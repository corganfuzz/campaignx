export const downloadImageFromUrl = async (url: string, filename: string): Promise<void> => {
    try {
        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status} ${response.statusText}`);
        }

        const blob = await response.blob();
        const mimeType = response.headers.get('content-type') || 'image/png';
        const typedBlob = new Blob([blob], { type: mimeType });

        const blobUrl = URL.createObjectURL(typedBlob);

        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();

        setTimeout(() => {
            URL.revokeObjectURL(blobUrl);
            document.body.removeChild(link);
        }, 150);
    } catch (err) {
        console.error('[CampaignX] Blob download failed, opening in new tab as fallback:', err);
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
