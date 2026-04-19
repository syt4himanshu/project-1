import { Component, type ReactNode, type ErrorInfo } from 'react'

interface ErrorBoundaryProps {
    children: ReactNode
    fallback?: ReactNode
    onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface ErrorBoundaryState {
    hasError: boolean
    error: Error | null
}

/**
 * Error Boundary Component
 * Catches React component errors and displays fallback UI
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = {
            hasError: false,
            error: null,
        }
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return {
            hasError: true,
            error,
        }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        // Log error to console
        console.error('ErrorBoundary caught an error:', error, errorInfo)

        // Call custom error handler if provided
        this.props.onError?.(error, errorInfo)

        // In production, you could send to error tracking service
        // e.g., Sentry.captureException(error, { extra: errorInfo })
    }

    handleReset = (): void => {
        this.setState({
            hasError: false,
            error: null,
        })
    }

    render(): ReactNode {
        if (this.state.hasError) {
            // Use custom fallback if provided
            if (this.props.fallback) {
                return this.props.fallback
            }

            // Default fallback UI
            return (
                <div
                    style={{
                        padding: '2rem',
                        maxWidth: '600px',
                        margin: '2rem auto',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        backgroundColor: '#fef2f2',
                    }}
                >
                    <h2 style={{ color: '#dc2626', marginBottom: '1rem' }}>
                        Something went wrong
                    </h2>
                    <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                        We encountered an unexpected error. Please try refreshing the page.
                    </p>
                    {this.state.error && (
                        <details style={{ marginBottom: '1rem' }}>
                            <summary style={{ cursor: 'pointer', color: '#6b7280' }}>
                                Error details
                            </summary>
                            <pre
                                style={{
                                    marginTop: '0.5rem',
                                    padding: '1rem',
                                    backgroundColor: '#f9fafb',
                                    borderRadius: '4px',
                                    overflow: 'auto',
                                    fontSize: '0.875rem',
                                }}
                            >
                                {this.state.error.toString()}
                            </pre>
                        </details>
                    )}
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            onClick={this.handleReset}
                            style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                            }}
                        >
                            Try Again
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: '#6b7280',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                            }}
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}
