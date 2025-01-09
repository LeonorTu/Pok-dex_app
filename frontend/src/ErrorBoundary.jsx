import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen">
          <img 
            src="/img/pikachu.png"
            alt="Sad Pikachu"
            className="w-40 h-40 mb-4" 
          />
          <h1 className="text-xl leading-7 text-center mb-4 font-poppins">
            Oops, something went wrong.<br />
            We're on it, and hopefully we will get it fixed ASAP! 🛠️💖<br />
            Thank you for your patience! 🙏✨
          </h1>
        </div>
      );
    }
    return this.props.children; 
  }
}

export default ErrorBoundary;
