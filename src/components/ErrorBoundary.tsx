// ===== Apple HIG Isolated Error Boundary Component (Section 1C) =====
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AlertTriangle, RotateCcw } from 'lucide-react-native';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
  onRetry?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary caught error]:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <View style={styles.fallbackContainer}>
          <View style={styles.iconCircle}>
            <AlertTriangle size={24} color="#FF3B30" strokeWidth={2} />
          </View>
          <Text style={styles.title}>
            {this.props.fallbackTitle || 'Unable to Display Content'}
          </Text>
          <Text style={styles.message}>
            {this.props.fallbackMessage ||
              this.state.error?.message ||
              'An unexpected error occurred while rendering this module.'}
          </Text>
          <TouchableOpacity
            onPress={this.handleRetry}
            activeOpacity={0.7}
            style={styles.retryButton}
          >
            <RotateCcw size={15} color="#007AFF" style={{ marginRight: 6 }} />
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  fallbackContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    borderRadius: 16,
    marginVertical: 8,
    backgroundColor: 'rgba(120, 120, 128, 0.08)',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 59, 48, 0.2)',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 59, 48, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(0, 0, 0, 0.88)',
    textAlign: 'center',
    marginBottom: 4,
  },
  message: {
    fontSize: 13,
    color: 'rgba(60, 60, 67, 0.60)',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 14,
    maxWidth: 280,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 122, 255, 0.12)',
  },
  retryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
});
