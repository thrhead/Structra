import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

const CustomSpinner = ({ size = 'large', color, style, ...props }) => {
  const rotation = useRef(new Animated.Value(0)).current;

  let spinnerColor = color;
  if (!color) {
    if (size === 'small') {
      spinnerColor = '#722ed1';
    } else {
      spinnerColor = '#00d4ff';
    }
  }

  let sizeNum = 32;
  let borderWidth = 3;
  if (size === 'small') {
    sizeNum = 20;
    borderWidth = 2;
  } else if (size === 'large') {
    sizeNum = 40;
    borderWidth = 4;
  } else if (typeof size === 'number') {
    sizeNum = size;
  }

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 800,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [rotation]);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={{
          width: sizeNum,
          height: sizeNum,
          borderRadius: sizeNum / 2,
          borderWidth: borderWidth,
          borderColor: spinnerColor + '40', // 25% opacity
          borderTopColor: spinnerColor,
          transform: [{ rotate: spin }],
        }}
      />
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
