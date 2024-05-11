import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    Alert.alert('Login Success', 'Successfully logged in!');
  };

  const handleSignup = () => {
    Alert.alert('Signup', 'Signup');
  };

  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Text style={styles.logoText}>LOGO</Text>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>E-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="fuki.sipic@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="●●●●●●●●●●"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Sign in</Text>
      </TouchableOpacity>
      <Text style={styles.signupText}>Don't have an account?</Text>
      <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
        <Text style={styles.signupButtonText}>Sign up</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    marginBottom: 40,
    backgroundColor: '#A4a4a4', // Grey background
    width: 150, // Diameter of the circle
    height: 150, // Diameter of the circle
    borderRadius: 100, // Half the diameter to make it a perfect circle
    justifyContent: 'center', // Center the text vertically
    alignItems: 'center', // Center the text horizontally
  },
  logoText: {
    color: '#000', // White text color
    fontSize: 30, // Adjust the size as needed
    fontWeight: 'bold'
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  inputLabel: {
    alignSelf: 'stretch',
    marginLeft: 5,
    marginBottom: 0,
    color: '#36A4F4'
  },
  input: {
    height: 40,
    borderWidth: 2,
    padding: 10,
    borderRadius: 10, // Making borders round
  },
  button: {
    marginTop: 20,
    width: '80%',
    backgroundColor: '#007bff', // Bootstrap primary button color
    padding: 10,
    borderRadius: 10, // Making button corners round like input fields
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold'
  },
  signupText:{
    marginTop: 100,
    color: 'grey'
  },
  signupButton:{
    backgroundColor: '#F2F2F2',
    marginTop: 10,
    width: '80%',
    borderColor: '#007bff', // Blue border color
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  signupButtonText: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold'
  }
});