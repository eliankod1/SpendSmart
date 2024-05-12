import React from 'react';
import Register from './Register'; // Import the Register component
import { View, StyleSheet } from 'react-native';
import Login from './Login'; // Import the Login component
import Carousel from './naciniStednje';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import Dashboard from "./Dashboard";



const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
        name="Carousel"
        component={Carousel}
        options={{ headerShown: false }}
        />
        <Stack.Screen
        name="Dashboard"
        component={Dashboard}
        options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

