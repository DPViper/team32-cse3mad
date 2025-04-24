import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
  ViewStyle,
  StyleProp,
} from 'react-native';

type ButtonProps = {
  onPress: (event: GestureResponderEvent) => void;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'solid' | 'ghost';
};

export const Button = ({ onPress, children, style, variant = 'solid' }: ButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        variant === 'ghost' ? styles.ghost : styles.solid,
        style,
      ]}
    >
      <Text style={[styles.text, variant === 'ghost' ? styles.ghostText : {}]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignItems: 'center',
  },
  solid: {
    backgroundColor: '#7A5C4A', // Dark brown
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans',
  },
  ghostText: {
    color: '#7A5C4A',
  },
});
