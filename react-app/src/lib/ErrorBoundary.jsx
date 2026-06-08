import { Component } from "react";

/** Minimal error boundary. Wrap non-essential chrome (e.g. the preloader/cursor)
 *  so a bug there can never white-screen the site. Renders `fallback` (default
 *  null) instead of crashing the whole tree. */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error) {
    if (typeof console !== "undefined") console.warn("[ErrorBoundary] caught:", error?.message);
  }
  render() {
    if (this.state.hasError) return this.props.fallback ?? null;
    return this.props.children;
  }
}
