import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';

export const Input = (props: TextInputProps) => {
  return (
    <TextInput
      placeholderTextColor="#7A5C4A"
      style={[styles.input, props.style]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#FFF',
    borderColor: '#D5BDAF',
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    fontFamily: 'PlusJakartaSans',
    color: '#4A372D',
    marginBottom: 12,
  },
});
