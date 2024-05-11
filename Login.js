import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { FIREBASE_AUTH } from './FirebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const handleLogin = async () => {
    setLoading(true);
    try{ 
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
    finally{
    setLoading(false);
    }
  };

  const handleSignup = async () => {
    setLoading(true);
    try{ 
      const response = await createUserWithEmailAndPassword(auth, email, password);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
    finally{
    setLoading(false);
    }
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
          value={email}
          onChangeText={(text) => setEmail(text)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
        />
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
            <View >
              <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Sign in</Text>
              </TouchableOpacity>
              <Text style={styles.signupText}>Don't have an account?</Text>
              <TouchableOpacity
                style={styles.signupButton}
                onPress={handleSignup}
              >
                <Text style={styles.signupButtonText}>Sign up</Text>
              </TouchableOpacity>
              <StatusBar style="auto" />
            </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
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
    width: '75%',
    marginBottom: 15,
  },
  inputLabel: {
    alignSelf: 'flex-start',
    marginLeft: 5,
    marginBottom: 0,
    color: '#36A4F4'
  },
  input: {
    height: 40,
    borderWidth: 2,
    padding: 10,
    borderRadius: 10,
    width: '100%', // Percentage width relative to the inputContainer
    alignSelf: 'flex-start' // Centers the input field within the inputContainer
  }, 
  button: {
    marginTop: 20,
    width: '100%',
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
    textAlign: "center",
    marginTop: 100,
    color: 'grey'
  },
  signupButton:{
    backgroundColor: '#F2F2F2',
    marginTop: 10,
    width: '100%',
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