import { Component } from "react";
import { AlertTriangle } from "lucide-react";
import styles from "./ErrorBoundary.module.css";

// Error boundaries must be class components — React has no hook equivalent
// for getDerivedStateFromError / componentDidCatch.
export class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("Trax crashed:", error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.error) {
      return (
        <div className={styles.wrapper} role="alert">
          <AlertTriangle className={styles.icon} aria-hidden="true" />
          <h2>Something went wrong</h2>
          <p className={styles.message}>
            {this.state.error.message || "An unexpected error occurred."}
          </p>
          <button className={styles.retryButton} onClick={this.handleReset}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
