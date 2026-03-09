/**
 * Download an image from a presigned S3 URL to the user's local disk.
 *
 * Strategy:
 *  1. Fetch the image as a Blob (works once S3 CORS allows the frontend origin).
 *  2. Build an ephemeral blob: URL and click a hidden <a download> link.
 *  3. If the fetch fails for any reason (e.g. CORS not yet propagated),
 *     fall back to opening the URL in a new tab so the user can still
 *     use the browser's own Save dialog.
 */
export const downloadImageFromUrl = async (url: string, filename: string): Promise<void> => {
    try {
        const response = await fetch(url, {
            method: 'GET',
            // 'cors' mode — S3 will now respond with the correct CORS headers
            // because we added the aws_s3_bucket_cors_configuration in Terraform.
            mode: 'cors',
            cache: 'no-store', // Bypass disk cache which may not have CORS headers
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status} ${response.statusText}`);
        }

        const blob = await response.blob();

        // Determine a safe MIME type — presigned URLs always serve the original content type
        const mimeType = response.headers.get('content-type') || 'image/png';
        const typedBlob = new Blob([blob], { type: mimeType });

        const blobUrl = URL.createObjectURL(typedBlob);

        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();

        // Clean up: small timeout lets the browser register the click before revoke
        setTimeout(() => {
            URL.revokeObjectURL(blobUrl);
            document.body.removeChild(link);
        }, 150);
    } catch (err) {
        console.error('[CampaignX] Blob download failed, opening in new tab as fallback:', err);
        // As a fallback, tell the browser to open the file — the user can right-click > Save As
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.target = '_blank';
        link.rel = 'noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};
