import React from "react";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo)
    }
    render() {
        if (this.state.hasError) {
            return (
                <div style={{ textAlign: "center", padding: "2rem" }}>
                    <h2>Something went wrong 😢</h2>
                    <p>{this.state.error?.message}</p>
                    <button onClick={() => window.location.reload()}>Reload</button>
                </div>
            )
        }
        return this.props.children;
    }
}
export default ErrorBoundary