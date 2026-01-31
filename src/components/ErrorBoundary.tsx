import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children?: ReactNode;
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

  // Explicitly declare props to resolve TS error if base class types aren't inferred
  public props: Props;

  constructor(props: Props) {
    super(props);
    this.props = props;
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-kala-900 flex flex-col items-center justify-center p-4 text-center">
          <div className="bg-red-500/10 p-6 rounded-full mb-6 border border-red-500/20">
            <AlertTriangle className="w-16 h-16 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Something went wrong</h1>
          <p className="text-kala-400 mb-8 max-w-md">
            The application encountered an unexpected error. Our team has been notified.
          </p>
          <div className="bg-kala-800 p-4 rounded-lg mb-8 max-w-lg w-full overflow-hidden text-left border border-kala-700">
             <code className="text-red-300 font-mono text-xs break-all">
                {this.state.error?.toString()}
             </code>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => window.location.reload()} 
              className="flex items-center gap-2 px-6 py-3 bg-kala-secondary text-kala-900 font-bold rounded-xl hover:bg-cyan-400 transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Reload Page
            </button>
            <button 
              onClick={() => window.location.href = '/'} 
              className="flex items-center gap-2 px-6 py-3 bg-kala-800 text-white font-bold rounded-xl hover:bg-kala-700 transition-colors border border-kala-600"
            >
              <Home className="w-4 h-4" /> Go Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}