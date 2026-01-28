import React, { Component } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

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
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="max-w-md w-full text-center">
            <CardHeader>
              {/* Error Icon */}
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-destructive/20 rounded-full">
                  <AlertTriangle className="w-8 h-8 text-destructive" />
                </div>
              </div>
              <CardTitle>Something went wrong</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                The application encountered an unexpected error. Please try refreshing the page or return to the home page.
              </p>

              {/* Error Details (Expandable) */}
              <Alert variant="destructive">
                <details className="text-left">
                  <summary className="cursor-pointer mb-2 font-medium">
                    Technical Details
                  </summary>
                  <AlertDescription>
                    <pre className="text-xs overflow-auto max-h-32 mt-2">
                      {this.state.error?.stack || this.state.error?.message || 'Unknown error occurred'}
                    </pre>
                  </AlertDescription>
                </details>
              </Alert>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => window.location.reload()}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Page
                </Button>

                <Button
                  variant="outline"
                  onClick={() => window.location.href = '/'}
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
