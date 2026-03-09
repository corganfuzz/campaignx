import './ErrorScreen.css'

import Alert from '@spectrum-icons/workflow/Alert'

interface ErrorScreenProps {
    failureReason: string | null
    onRetry: () => void
    onHome: () => void
}

export const ErrorScreen = ({ failureReason, onRetry, onHome }: ErrorScreenProps) => {
    return (
        <div className="error-screen">
            <div className="error-container">
                <div className="error-icon"><Alert size="M" color="notice" /></div>
                <h2 className="error-title">Campaign Generation Failed</h2>
                <p className="error-message">
                    {failureReason || 'An unexpected error occurred during campaign generation.'}
                </p>
                <div className="error-actions">
                    <button className="error-btn retry" onClick={onRetry}>
                        Try Again
                    </button>
                    <button className="error-btn home" onClick={onHome}>
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    )
}
