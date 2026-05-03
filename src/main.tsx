import {Component, StrictMode, type ReactNode} from 'react';
import {createRoot} from 'react-dom/client';
import {LazyMotion, domAnimation} from 'motion/react';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryState {
  error: Error | null;
}

class ErrorBoundary extends Component<{children: ReactNode}, ErrorBoundaryState> {
  // React 19's Component class declares `props` in a way TS doesn't infer
  // through generics by default; redeclare so `this.props` typechecks.
  declare props: {children: ReactNode};
  state: ErrorBoundaryState = {error: null};

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {error};
  }

  componentDidCatch(error: Error, info: unknown): void {
    console.error('Unhandled application error:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            minHeight: '100dvh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            background: '#eaeaeb',
            color: '#1A1A1A',
            fontFamily: '"Montserrat", system-ui, sans-serif',
            textAlign: 'center',
          }}
        >
          <div style={{maxWidth: 420}}>
            <h1 style={{fontSize: 24, fontWeight: 700, marginBottom: 12}}>
              Something went wrong
            </h1>
            <p style={{color: '#78716C', marginBottom: 20, lineHeight: 1.5}}>
              The app failed to load. Please refresh the page — if the issue
              persists, the deployment may be missing its API key.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: '#E60000',
                color: 'white',
                padding: '14px 28px',
                borderRadius: 999,
                border: 'none',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      {/*
        LazyMotion + the `domAnimation` feature pack ships only the
        animation features actually in use (~17 KB) instead of the full
        ~94 KB Framer bundle. `strict` enforces that we use `m.X`
        components everywhere instead of `motion.X` so we never
        accidentally re-balloon the bundle.
      */}
      <LazyMotion features={domAnimation} strict>
        <App />
      </LazyMotion>
    </ErrorBoundary>
  </StrictMode>,
);
