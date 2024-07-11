import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FIREBASE_DB, FIREBASE_AUTH } from "./FirebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { BarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

const ZeroBased = ({ navigation }) => {
  const [expenses, setExpenses] = useState([]);
  const [needs, setNeeds] = useState(0);
  const [wants, setWants] = useState(0);
  const [savings, setSavings] = useState(0);

  useEffect(() => {
    const fetchExpenses = async () => {
      const user = FIREBASE_AUTH.currentUser;
      if (user) {
        const querySnapshot = await getDocs(
          collection(FIREBASE_DB, "expenses")
        );
        const userExpenses = querySnapshot.docs
          .map((doc) => doc.data())
          .filter((expense) => expense.userId === user.uid);

        setExpenses(userExpenses);

        const totalNeeds = userExpenses
          .filter((expense) => expense.type === "need")
          .reduce((sum, expense) => sum + parseFloat(expense.price), 0);
        const totalWants = userExpenses
          .filter((expense) => expense.type === "want")
          .reduce((sum, expense) => sum + parseFloat(expense.price), 0);
        const totalSavings = userExpenses
          .filter((expense) => expense.type === "saving")
          .reduce((sum, expense) => sum + parseFloat(expense.price), 0);

        setNeeds(totalNeeds);
        setWants(totalWants);
        setSavings(totalSavings);
      }
    };

    fetchExpenses();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.goBackButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.goBackButtonText}>{"<"}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Zero-based</Text>
      <Text style={styles.estimatedBudget}>
        Procijenjen budžet: {needs + wants + savings} €
      </Text>
      <Text style={styles.lastMonthBudget}>Prošlomjesečni budžet: 1000 €</Text>
      <BarChart
        data={{
          labels: ["Potrebe", "Želje", "Štednja"],
          datasets: [
            {
              data: [needs, wants, savings],
            },
          ],
        }}
        width={Dimensions.get("window").width - 60}
        height={220}
        yAxisLabel="€"
        chartConfig={{
          backgroundColor: "#ffffff",
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(54, 164, 244, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForBackgroundLines: {
            stroke: "#e3e3e3",
            strokeDasharray: "",
          },
          propsForLabels: {
            fontSize: 12,
            fontWeight: "bold",
          },
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
          alignSelf: "center",
        }}
        fromZero={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    textAlign: "center",
    fontSize: 35,
    fontWeight: "bold",
    marginTop: "40%", 
    marginBottom: 45,
  },
  estimatedBudget: {
    fontSize: 22,
    marginTop: 10,
    marginBottom: 15,
    marginLeft: 10,
    textAlign: "left",
  },
  lastMonthBudget: {
    fontSize: 18,
    marginBottom: 10,
    marginLeft: 10,
    marginBottom: 45,
    textAlign: "left",
  },
  goBackButton: {
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

export default ZeroBased;
