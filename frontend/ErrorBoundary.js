import React from 'react';
import { View, Text } from 'react-native';

export default class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // You can log error info here if needed
    console.log('ErrorBoundary caught an error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Something went wrong:</Text>
          <Text>{this.state.error?.toString()}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}