import "react-native-gesture-handler";
import React from "react";
import Register from "./Register";
import { View, StyleSheet } from "react-native";
import Login from "./Login";
import Carousel from "./naciniStednje";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import PovijestTroskova from "./povijestTroskova";
import Dashboard from "./dashboard";
import AddExpense from "./AddExpense";
import CategoryScreen from "./CategoryScreen"; 
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MonthlyExpenseReport from "./50_30_20";
import ZeroBased from "./zeroBased"; 
import Envelope from "./Envelope";

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <GestureHandlerRootView>
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
          <Stack.Screen
            name="AddExpense"
            component={AddExpense}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="PovijestTroskova"
            component={PovijestTroskova}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CategoryScreen"
            component={CategoryScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MonthlyExpenseReport"
            component={MonthlyExpenseReport}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ZeroBased"
            component={ZeroBased}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Envelope"
            component={Envelope}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
