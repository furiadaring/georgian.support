"use client";

import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to an error reporting service
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-100 flex items-center justify-center p-8">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-primary-black mb-2">
                Что-то пошло не так
              </h2>
              <p className="text-primary-grey mb-4">
                Произошла ошибка при загрузке этого раздела.
              </p>
              <button
                onClick={() => this.setState({ hasError: false })}
                className="btn-primary"
              >
                Попробовать снова
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
