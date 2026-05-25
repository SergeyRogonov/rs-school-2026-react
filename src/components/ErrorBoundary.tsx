import React from 'react';
import type { ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error('Error caught by boundary:', error);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-(--bg-secondary) gap-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-(--brand-header) mb-2">
              Something went wrong
            </h2>
            <p className="text-(--text-secondary)">
              {this.state.error?.message}
            </p>
          </div>
          <button
            onClick={this.handleReset}
            className="px-4 py-2 bg-(--brand-header) text-(--bg-secondary) rounded hover:bg-(--border-color)"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
