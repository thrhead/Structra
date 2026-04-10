import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

const CustomSpinner = ({ size = 'large', color, style, ...props }) => {
  // Determine color based on size if not explicitly provided
  // Matching the web design: default/large -> #00d4ff, small -> #722ed1
  let spinnerColor = color;
  if (!color) {
    if (size === 'small' || size === 'small') {
      spinnerColor = '#722ed1';
    } else {
      spinnerColor = '#00d4ff';
    }
  }

  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={spinnerColor} {...props} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomSpinner;
