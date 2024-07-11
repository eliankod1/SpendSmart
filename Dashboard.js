import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { FIREBASE_DB, FIREBASE_AUTH } from "./FirebaseConfig";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SwipeListView } from "react-native-swipe-list-view";
import { useFocusEffect } from "@react-navigation/native";
import CategoryButton from "./CategoryButton";
import { PieChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";

const categoryColors = {
  Hrana: "#B37DE8",
  Druženje: "#7DE8E8",
  Transport: "#B2E87D",
  Ostalo: "#E87D7D",
};

const Dashboard = ({ navigation }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryData, setCategoryData] = useState([]);
  const [username, setUsername] = useState("");
  const [needs, setNeeds] = useState(0);
  const [wants, setWants] = useState(0);
  const [savings, setSavings] = useState(0);
  const [savingsMethod, setSavingsMethod] = useState("");
  const [estimatedBudget, setEstimatedBudget] = useState(0);
  const [budgetNeeds, setBudgetNeeds] = useState(0);
  const [budgetWants, setBudgetWants] = useState(0);
  const [budgetSavings, setBudgetSavings] = useState(0);

  const formatDate = (timestamp) => {
    if (timestamp instanceof Timestamp) {
      const date = timestamp.toDate();
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
    return timestamp;
  };

  const handleLogout = () => {
    FIREBASE_AUTH.signOut()
      .then(() => {
        navigation.navigate("Login");
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  };

  const fetchUsername = async () => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
      const userDoc = await getDoc(doc(FIREBASE_DB, "users", user.uid));
      if (userDoc.exists()) {
        setUsername(userDoc.data().name);
      } else {
        console.log("Nema takvog dokumenta!");
      }
    } else {
      console.log("Nijedan korisnik nije prijavljen.");
    }
  };

  const fetchSavingsMethod = async () => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
      const userDoc = await getDoc(doc(FIREBASE_DB, "users", user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        const method = data.savingsMethod;
        if (["ZeroBased", "50_30_20", "Envelope"].includes(method)) {
          setSavingsMethod(method);
          setBudgetNeeds(data.budgetNeeds || 0);
          setBudgetWants(data.budgetWants || 0);
          setBudgetSavings(data.budgetSavings || 0);
        } else {
          console.log("Invalid savings method");
        }
      } else {
        console.log("No such document!");
      }
    } else {
      console.log("No user is signed in.");
    }
  };

  const fetchItems = async () => {
    const user = FIREBASE_AUTH.currentUser;
    const q = query(
      collection(FIREBASE_DB, "expenses"),
      where("userId", "==", user.uid)
    );
    const querySnapshot = await getDocs(q);
    const items = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      Object.keys(data).forEach((key) => {
        data[key] = formatDate(data[key]);
      });
      return {
        ...data,
        key: doc.id,
      };
    });
    setItems(items);
    setLoading(false);

    const categoryTotals = items.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + parseFloat(item.price);
      return acc;
    }, {});

    const totalAmount = Object.values(categoryTotals).reduce(
      (sum, value) => sum + value,
      0
    );

    const chartData = Object.keys(categoryTotals).map((category) => ({
      name: "€ - " + category,
      amount: categoryTotals[category],
      color: categoryColors[category],
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
      percentage: ((categoryTotals[category] / totalAmount) * 100).toFixed(2),
    }));

    setCategoryData(chartData);

    const totalNeeds = items
      .filter((item) => item.type === "need")
      .reduce((sum, item) => sum + parseFloat(item.price), 0);
    const totalWants = items
      .filter((item) => item.type === "want")
      .reduce((sum, item) => sum + parseFloat(item.price), 0);
    const totalSavings = items
      .filter((item) => item.type === "saving")
      .reduce((sum, item) => sum + parseFloat(item.price), 0);

    console.log("Total Needs:", totalNeeds);
    console.log("Total Wants:", totalWants);
    console.log("Total Savings:", totalSavings);

    setNeeds(totalNeeds);
    setWants(totalWants);
    setSavings(totalSavings);
    setEstimatedBudget(totalNeeds + totalWants + totalSavings);
  };

  const handleDeleteExpense = async (id) => {
    try {
      await deleteDoc(doc(FIREBASE_DB, "expenses", id));
      fetchItems();
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUsername();
      fetchItems();
      fetchSavingsMethod();
    }, [])
  );

  if (loading) {
    return <Text>Učitavnje...</Text>;
  }

  const handleCategoryPress = (category) => {
    navigation.navigate("CategoryScreen", { category });
  };

  const handleArrowPress = () => {
    if (savingsMethod === "50_30_20") {
      navigation.navigate("MonthlyExpenseReport");
    } else if (savingsMethod === "ZeroBased") {
      navigation.navigate("ZeroBased");
    } else {
      navigation.navigate("Envelope");
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={30} color="black" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("AddExpense")}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.greetingText}>Pozdrav, {username}</Text>
        <View style={styles.greyCircle} />
        <PieChart
          data={categoryData}
          width={Dimensions.get("window").width}
          height={220}
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="05"
          absolute
          hasLegend={true}
          center={[10, 0]}
          renderDotContent={({ x, y, index }) => (
            <Text
              key={index}
              style={{
                position: "absolute",
                top: y,
                left: x,
                color: "black",
                fontSize: 10,
                fontWeight: "bold",
              }}
            >
              {categoryData[index].percentage}%
            </Text>
          )}
        />
        <View style={styles.buttonRow}>
          {Object.keys(categoryColors).map((category) => (
            <CategoryButton
              key={category}
              category={category}
              color={categoryColors[category]}
              onPress={handleCategoryPress}
            />
          ))}
        </View>
        <View style={styles.rectangle}>
          <View style={styles.headerRow_rectangle}>
            {savingsMethod === "ZeroBased" ? (
              <Text style={styles.rectangleText}>
                Procijenjen budžet: {estimatedBudget} €
              </Text>
            ) : (
              <Text style={styles.rectangleText}>Mjesečni troškovi</Text>
            )}
            <TouchableOpacity
              style={styles.arrowButton}
              onPress={handleArrowPress}
            >
              <Text style={styles.arrowText}>{">"}</Text>
            </TouchableOpacity>
          </View>
          {savingsMethod === "ZeroBased" ? (
            <View style={styles.expenseColumns}>
              <View style={styles.column}>
                <Text style={styles.columnTitle}>Potrebe</Text>
                <Text style={styles.columnValue}>{needs} €</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.columnTitle}>Želje</Text>
                <Text style={styles.columnValue}>{wants} €</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.columnTitle}>Štednja</Text>
                <Text style={styles.columnValue}>{savings} €</Text>
              </View>
            </View>
          ) : (
            <View style={styles.expenseColumns}>
              <View style={styles.column}>
                <Text style={styles.columnTitle}>Potrebe</Text>
                <Text style={styles.columnValue}>
                  {needs}/{budgetNeeds} €
                </Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.columnTitle}>Želje</Text>
                <Text style={styles.columnValue}>
                  {wants}/{budgetWants} €
                </Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.columnTitle}>Štednja</Text>
                <Text style={styles.columnValue}>
                  {savings}/{budgetSavings} €
                </Text>
              </View>
            </View>
          )}
        </View>
        <View style={styles.recentExpensesHeader}>
          <Text style={styles.recentExpensesTitle}>Nedavni troškovi</Text>
          <TouchableOpacity
            style={styles.seeAllButton}
            onPress={() => navigation.navigate("PovijestTroskova")}
          >
            <Text style={styles.seeAllButtonText}>Vidi sve</Text>
          </TouchableOpacity>
        </View>
        <SwipeListView
          data={items}
          renderItem={({ item }) => {
            const borderColor = categoryColors[item.category] || "#F2F2F2";
            return (
              <View
                style={[styles.itemContainer, { borderTopColor: borderColor }]}
              >
                <Text style={styles.nameText}>{item.name}</Text>
                <Text style={styles.dateText}>{item.date}</Text>
                <Text style={styles.priceText}>{item.price} €</Text>
              </View>
            );
          }}
          renderHiddenItem={(data, rowMap) => (
            <View style={styles.rowBack}>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteExpense(data.item.key)}
              >
                <Text style={styles.deleteButtonText}>Obriši</Text>
              </TouchableOpacity>
            </View>
          )}
          rightOpenValue={-75}
          keyExtractor={(item) => item.key}
          ListEmptyComponent={() => (
            <Text style={styles.emptyListText}>
              Nema pronađenih troškova. Dodajte novi trošak!
            </Text>
          )}
        />
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  logoutButton: {
    marginRight: 10,
  },
  deleteButton: {
    paddingTop: 30,
    paddingRight: 0,
    marginBottom: 20,
    backgroundColor: "#ff3b30",
    alignItems: "flex-end",
    width: "100%",
    height: "99%",
    borderRadius: 10,
    borderTopLeftRadius: 10,
    marginHorizontal: 10,
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -5,
    marginRight: 8,
  },
  itemContainer: {
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderTopWidth: 5,
    flexDirection: "row",
    marginHorizontal: 15,
    padding: 20,
    backgroundColor: "#F2F2F2",
    borderWidth: 1,
    borderBottomColor: "#F2F2F2",
    marginBottom: 10,
    borderRadius: 7,
    borderTopEndRadius: 10,
    elevation: 5,
  },
  addButton: {
    alignSelf: "flex-end",
  },
  addButtonText: {
    fontSize: 40,
    color: "black",
  },
  container: {
    flex: 1,
    marginTop: 40,
    backgroundColor: "#FFFFFF",
  },
  nameText: {
    flex: 1,
    fontSize: 20,
    color: "black",
    textAlign: "left",
  },
  dateText: {
    flex: 1,
    fontSize: 19,
    color: "black",
    textAlign: "center",
  },
  priceText: {
    flex: 1,
    fontSize: 20,
    color: "black",
    textAlign: "right",
  },
  rowBack: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingLeft: 10,
    paddingTop: 10,
    marginRight: 7,
    marginHorizontal: 15,
    overflow: "hidden",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    marginHorizontal: 10,
  },
  recentExpensesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginHorizontal: 15,
  },
  recentExpensesTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  greetingText: {
    marginTop: 10,
    marginLeft: 25,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 0,
    textAlign: "left",
  },
  emptyListText: {
    textAlign: "center",
    color: "gray",
    marginTop: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
  },
  headerRow_rectangle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 5,
  },
  rectangle: {
    borderWidth: 2,
    borderColor: "#36A4F4",
    borderRadius: 10,
    padding: 8,
    marginTop: 5,
    marginBottom: 25,
    marginHorizontal: 15,
  },
  rectangleText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  arrowButton: {
    alignSelf: "flex-end",
  },
  arrowText: {
    fontSize: 24,
  },
  expenseColumns: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 6,
  },
  column: {
    flex: 1,
    alignItems: "center",
  },
  columnTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#36A4F4",
  },
  columnValue: {
    fontSize: 14,
    color: "gray",
  },
  greyCircle: {
    position: "absolute",
    marginLeft: 35,
    marginTop: 120,
    width: Dimensions.get("window").width / 2.4,
    height: Dimensions.get("window").width / 2.4,
    borderRadius: Dimensions.get("window").width / 2,
    backgroundColor: "grey",
    opacity: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: -1,
  },
});

export default Dashboard;
