import React, { Component } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { 
      hasError: true,
      error: error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 max-w-md w-full text-center">
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-red-500/20 rounded-full">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
            </div>

            {/* Error Title */}
            <h1 className="text-2xl font-bold text-white mb-4">
              Something went wrong
            </h1>
            
            <p className="text-slate-300 mb-6">
              The application encountered an unexpected error. Please try refreshing the page or return to the home page.
            </p>

            {/* Error Details (Expandable) */}
            <details className="text-left mb-6 p-3 bg-black/30 rounded-lg">
              <summary className="text-slate-400 cursor-pointer mb-2">
                Technical Details
              </summary>
              <pre className="text-xs text-red-300 overflow-auto professional-scroll max-h-32">
                {this.state.error?.stack || this.state.error?.message || 'Unknown error occurred'}
              </pre>
            </details>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Refresh Button */}
              <button
                onClick={() => window.location.reload()}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200 hover:scale-105"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh Page
              </button>
              
              {/* Home Button */}
              <button
                onClick={() => window.location.href = '/'}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl text-white transition-all duration-200 hover:scale-105"
              >
                <Home className="w-4 h-4" />
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
} 