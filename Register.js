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
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { setDoc, doc } from "firebase/firestore";
import spendsmartLogo from "./assets/spendsmart_logo_1.png";

export default function Register() {
  const [_name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const auth = FIREBASE_AUTH;
  const navigation = useNavigation();

  const handleSignup = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      if (signInMethods.length > 0) {

        setErrorMessage("Email adresa je već u uporabi. Molimo upotrijebite drugu.");
      } else {
        const response = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = response.user;
        await setDoc(doc(FIREBASE_DB, "users", user.uid), {
          uid: user.uid,
          name: _name,
          email: user.email,
          savingsMethod: null,
        });
        console.log(response);
        navigation.navigate("Login");
      }
    } catch (error) {
      setErrorMessage("Dogodila se pogreška. Molim te pokušaj ponovno.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={spendsmartLogo} style={styles.logo} />
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Ime</Text>
        <TextInput
          style={styles.input}
          value={_name}
          onChangeText={setName}
          autoCapitalize="words"
        />
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
            <TouchableOpacity style={styles.button} onPress={handleSignup}>
              <Text style={styles.buttonText}>Registracija</Text>
            </TouchableOpacity>
            <Text style={styles.signupText}>Već imate račun?</Text>
            <TouchableOpacity
              style={styles.signupButton}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.signupButtonText}>Prijava</Text>
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
  button: {
    marginTop: 20,
    width: "100%",
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
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
    borderColor: "#1793f9",
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
  errorText: {
    color: "red",
    marginTop: 10,
  },
});
