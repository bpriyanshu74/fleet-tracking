import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full flex items-center justify-center py-16 px-4">
          <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-6 border border-red-100">
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-red-600 text-2xl">⚠️</span>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
              Something went wrong
            </h3>

            {/* Error message */}
            <p className="text-center text-red-600 text-sm mb-6">
              {this.state.error?.message || "Unexpected error occurred."}
            </p>

            {/* Retry button */}
            <button
              onClick={this.handleRetry}
              className="w-full py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
