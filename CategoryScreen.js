import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { FIREBASE_DB, FIREBASE_AUTH } from "./FirebaseConfig.js"; 
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SwipeListView } from "react-native-swipe-list-view";
import { useFocusEffect } from "@react-navigation/native";

const categoryColors = {
  Hrana: "#B37DE8",
  Druženje: "#7DE8E8",
  Transport: "#B2E87D",
  Ostalo: "#E87D7D",
};

const CategoryScreen = ({ route, navigation }) => {
  const { category } = route.params;

  const handleDeleteExpense = async (id) => {
    try {
      await deleteDoc(doc(FIREBASE_DB, "expenses", id));
      fetchItems(); 
    } catch (error) {
      console.error("Pogreška prilikom uklanjanja dokumenta: ", error);
    }
  };

  const renderRightActions = (data, rowMap) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteExpense(data.item.key)}
      >
        <Text style={styles.deleteButtonText}>Obriši</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }) => {
    const borderColor = categoryColors[item.category] || "#F2F2F2"; 
    return (
      <View style={[styles.itemContainer, { borderTopColor: borderColor }]}>
        <Text style={styles.nameText}>{item.name}</Text>
        <Text style={styles.dateText}>{item.date}</Text>
        <Text style={styles.priceText}>{item.price} €</Text>
      </View>
    );
  };

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const fetchItems = async () => {
    const user = FIREBASE_AUTH.currentUser; 
    if (user) {
      const q = query(
        collection(FIREBASE_DB, "expenses"),
        where("category", "==", category),
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
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchItems();
    }, [])
  );

  if (loading) {
    return <Text>Učitavanje...</Text>;
  }
  if (items.length === 0) {
    return <Text style={styles.noExpense}>Nisu pronađeni troškovi za kategoriju {category}. Dodaj novi trošak!</Text>;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View style={styles.CategoryScreen_row}>
        <TouchableOpacity
          style={styles.goBackButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.goBackButtonText}>{"<"}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("AddExpense", { category })}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <Text style={styles.title}>{category}</Text>
        <SwipeListView
          data={items}
          renderItem={renderItem}
          renderHiddenItem={renderRightActions}
          rightOpenValue={-75}
          keyExtractor={(item) => item.key}
        />
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
    fontSize: 35,
    fontWeight: "bold",
    paddingBottom: "20%",
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
    padding: 20,
    marginHorizontal: 15,
    backgroundColor: "#F2F2F2",
    borderWidth: 1,
    borderBottomColor: "#F2F2F2",
    marginBottom: 10,
    borderRadius: 7,
    borderTopEndRadius: 10,
    elevation: 7,
  },
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  addButtonText: {
    fontSize: 40,
    color: "black",
  },
  container: {
    flex: 1,
    marginTop: 10,
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
    fontSize: 20,
    color: "black",
    textAlign: "center",
  },
  priceText: {
    flex: 1,
    fontSize: 20,
    fontWeight: "bold",
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
  goBackButton: {
    paddingHorizontal: "5%",
    paddingVertical: "10%",
  },
  goBackButtonText: {
    fontSize: 35, 
    color: "black",
    fontWeight: "bold", 
  },
  CategoryScreen_row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginHorizontal: 15,
  },
  noExpense: {
    marginTop: 60,
    textAlign: "center",
  }
});

export default CategoryScreen;
