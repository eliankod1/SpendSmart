import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ProgressBarAndroid,
} from "react-native";
import { FIREBASE_DB, FIREBASE_AUTH } from "./FirebaseConfig";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
} from "firebase/firestore";

const MonthlyExpenseReport = ({ route, navigation }) => {
  const [budget, setBudget] = useState(1000);
  const [needs, setNeeds] = useState(0);
  const [wants, setWants] = useState(0);
  const [savings, setSavings] = useState(0);
  const [maxNeeds, setMaxNeeds] = useState(500);
  const [maxWants, setMaxWants] = useState(300);
  const [maxSavings, setMaxSavings] = useState(200);

  useEffect(() => {
    const fetchBudgetAndExpenses = async () => {
      const user = FIREBASE_AUTH.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(FIREBASE_DB, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const userBudget = userData.budget || 1000;
          setBudget(userBudget);
          setMaxNeeds(userBudget * 0.5);
          setMaxWants(userBudget * 0.3);
          setMaxSavings(userBudget * 0.2);

          const expensesQuery = await getDocs(
            collection(FIREBASE_DB, "expenses")
          );
          const expenses = expensesQuery.docs
            .map((doc) => doc.data())
            .filter((expense) => expense.userId === user.uid);

          const totalNeeds = expenses
            .filter((expense) => expense.type === "need")
            .reduce((sum, expense) => sum + parseFloat(expense.price), 0);
          const totalWants = expenses
            .filter((expense) => expense.type === "want")
            .reduce((sum, expense) => sum + parseFloat(expense.price), 0);
          const totalSavings = expenses
            .filter((expense) => expense.type === "saving")
            .reduce((sum, expense) => sum + parseFloat(expense.price), 0);

          setNeeds(totalNeeds);
          setWants(totalWants);
          setSavings(totalSavings);
        }
      }
    };
    fetchBudgetAndExpenses();
  }, [navigation]);

  const handleSaveBudget = async () => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
      const userDocRef = doc(FIREBASE_DB, "users", user.uid);
      await updateDoc(userDocRef, {
        budget: Number(budget),
        budgetNeeds: Number((budget * 0.5).toFixed(2)),
        budgetWants: Number((budget * 0.3).toFixed(2)),
        budgetSavings: Number((budget * 0.2).toFixed(2)),
      });
      setMaxNeeds(budget * 0.5);
      setMaxWants(budget * 0.3);
      setMaxSavings(budget * 0.2);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.goBackButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.goBackButtonText}>{"<"}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>50/30/20</Text>
      <Text style={styles.descriptionText}>Postavi budžet</Text>
      <TextInput
        value={String(budget)}
        onChangeText={(text) => setBudget(Number(text))}
        style={styles.input}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveBudget}>
        <Text style={styles.saveButtonText}>Postavi budžet</Text>
      </TouchableOpacity>
      <Text style={styles.progressText}>
        Potrebe: {needs}/{maxNeeds} €
      </Text>
      <ProgressBarAndroid
        styleAttr="Horizontal"
        indeterminate={false}
        progress={needs / maxNeeds}
      />
      <Text style={styles.progressText}>
        Želje: {wants}/{maxWants} €
      </Text>
      <ProgressBarAndroid
        styleAttr="Horizontal"
        indeterminate={false}
        progress={wants / maxWants}
      />
      <Text style={styles.progressText}>
        Štednja: {savings}/{maxSavings} €
      </Text>
      <ProgressBarAndroid
        styleAttr="Horizontal"
        indeterminate={false}
        progress={savings / maxSavings}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "top",
    padding: 30,
    backgroundColor: "#f5f5f5",
  },
  title: {
    textAlign: "center",
    fontSize: 35,
    fontWeight: "bold",
    marginTop: "40%",
    paddingBottom: "10%",
  },
  descriptionText: {
    fontSize: 18,
    fontWeight: "bold",
    paddingBottom: 10,
    marginTop: "10%",
    textAlign: "left",
  },
  input: {
    height: 50,
    borderWidth: 2,
    padding: 10,
    width: "100%",
    borderRadius: 10,
  },
  saveButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  progressText: {
    fontSize: 18,
    fontWeight: "bold",
    paddingBottom: 10,
    marginTop: "10%",
    textAlign: "left",
  },
  goBackButton: {
    paddingHorizontal: "5%",
    paddingVertical: "30%",
    position: "absolute",
    top: 40,
    left: 25,
    padding: 10,
    zIndex: 10,
  },
  goBackButtonText: {
    fontSize: 35,
    color: "black",
    fontWeight: "bold",
  },
});

export default MonthlyExpenseReport;
