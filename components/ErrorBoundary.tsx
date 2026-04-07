import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-6 text-center">
                    <div className="bg-red-500/20 p-6 rounded-3xl border border-red-500/30 max-w-lg">
                        <h2 className="text-2xl font-bold mb-4">Ups! Qualcosa è andato storto.</h2>
                        <p className="text-slate-400 mb-6">L'applicazione ha riscontrato un errore imprevisto. Prova a ricaricare la pagina.</p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold transition-all"
                        >
                            Ricarica Pagina
                        </button>
                        {process.env.NODE_ENV === 'development' && (
                            <div className="mt-6 text-left p-4 bg-black/40 rounded-xl overflow-auto max-h-40 text-xs font-mono text-red-300">
                                {this.state.error?.message}
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
