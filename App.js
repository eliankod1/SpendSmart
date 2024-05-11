import React from 'react';
import { View, StyleSheet } from 'react-native';
import Login from './Login'; // Import the Login component

export default function App() {
  return (
    <View style={styles.container}>
      <Login /> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
});