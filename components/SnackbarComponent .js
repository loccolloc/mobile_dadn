// SnackbarComponent.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const SnackbarComponent = ({ visible, message, onDismiss }) => {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      <TouchableOpacity onPress={onDismiss}>
        <Text style={styles.actionText}>OK</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    backgroundColor: 'black',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  message: {
    color: 'white',
    fontSize: 16,
  },
  actionText: {
    color: '#BB86FC',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default SnackbarComponent;
