import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { FIREBASE_AUTH, FIREBASE_DB } from "./FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import spendsmartLogo from "./assets/spendsmart_logo_1.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const auth = FIREBASE_AUTH;
  const navigation = useNavigation();

  const handleLogin = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      const user = response.user;
      const userDoc = await getDoc(doc(FIREBASE_DB, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.savingsMethod) {
          navigation.navigate("Dashboard");
        } else {
          navigation.navigate("Carousel");
        }
      }
    } catch (error) {
      setErrorMessage("Nevažeći email ili lozinka. Molim te pokušaj ponovno.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    setLoading(true);
    try {
      navigation.navigate("Register");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={spendsmartLogo} style={styles.logo} />
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
        <Text style={styles.inputLabel}>Lozinka</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
        />
        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <View>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Prijava</Text>
            </TouchableOpacity>
            <Text style={styles.signupText}>Nemate račun?</Text>
            <TouchableOpacity
              style={styles.signupButton}
              onPress={handleSignup}
            >
              <Text style={styles.signupButtonText}>Registracija</Text>
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
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  logo: {
    marginBottom: 40,
    backgroundColor: "#A4a4a4",
    width: 150,
    height: 150,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    width: "75%",
    marginBottom: 15,
  },
  inputLabel: {
    alignSelf: "flex-start",
    marginLeft: 5,
    marginBottom: 0,
    color: "#36A4F4",
  },
  input: {
    height: 40,
    borderWidth: 2,
    padding: 10,
    borderRadius: 10,
    width: "100%",
    alignSelf: "flex-start",
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
  button: {
    marginTop: 20,
    width: "100%",
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  signupText: {
    textAlign: "center",
    marginTop: 100,
    color: "grey",
  },
  signupButton: {
    backgroundColor: "#F2F2F2",
    marginTop: 10,
    width: "100%",
    borderColor: "#007bff",
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  signupButtonText: {
    color: "#000",
    fontSize: 20,
    fontWeight: "bold",
  },
});
