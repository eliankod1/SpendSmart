import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
} from "react-native";
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
import { addDoc } from "firebase/firestore";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";
import { SwipeListView } from "react-native-swipe-list-view";
import { useNavigation } from "@react-navigation/native";

const PovijestTroskova = ({ navigation }) => {
  const handleDeleteExpense = async (id) => {
    try {
      await deleteDoc(doc(FIREBASE_DB, "expenses", id));
      fetchItems(); 
    } catch (error) {
      console.error("Error removing document: ", error);
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
    const categoryColors = {
      Hrana: "#B37DE8",
      Druženje: "#7DE8E8",
      Transport: "#B2E87D",
      Ostalo: "#E87D7D",
    };

    const borderColor = categoryColors[item.category] || "black";

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
  };

  useEffect(() => {
    fetchItems();
  }, []);

  if (loading) {
    return <Text>Učitavanje...</Text>;
  }
  if (items.length === 0) {
    return <Text style={styles.nemaTroskova}>Nema pronađenih troškova. Dodajte novi trošak!</Text>;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.goBackButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.goBackButtonText}>{"<"}</Text>
        </TouchableOpacity>
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: 200,
  },
  container: {
    flex: 1,
    paddingTop: "32%",
    backgroundColor: "#FFFFFF",
  },
  nameText: {
    flex: 1,
    fontSize: 20,
    color: "#333",
    textAlign: "left",
  },
  dateText: {
    flex: 1,
    fontSize: 20,
    color: "#333",
    textAlign: "center",
  },
  priceText: {
    flex: 1,
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
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
  nemaTroskova: {
    textAlign: "center",
  }
});

export default PovijestTroskova;
