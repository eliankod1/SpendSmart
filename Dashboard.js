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
  Timestamp,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { FIREBASE_DB } from "./FirebaseConfig.js";
import { addDoc } from "firebase/firestore";
import DateTimePicker from "@react-native-community/datetimepicker";
import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler";
import { SwipeListView } from "react-native-swipe-list-view";

const Dashboard = () => {

  const handleDeleteExpense = async (id) => {
    try {
      await deleteDoc(doc(FIREBASE_DB, "expenses", id));
      fetchItems(); // Refresh the list after deletion
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
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.nameText}>{item.name}</Text>
      <Text style={styles.dateText}>{item.date}</Text>
      <Text style={styles.priceText}>{item.price} €</Text>
    </View>
  );

  const handleSaveExpense = async () => {
    const expenseData = {
      name: newExpenseName,
      price: newExpensePrice,
      date: newExpenseDate,
    };
    try {
      await addDoc(collection(FIREBASE_DB, "expenses"), expenseData);
      setModalVisible(false);
      fetchItems(); // Fetch items again to update the list
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newExpenseName, setNewExpenseName] = useState("");
  const [newExpensePrice, setNewExpensePrice] = useState("");
  const [newExpenseDate, setNewExpenseDate] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
    setNewExpenseDate(currentDate.toLocaleDateString("en-GB")); // Formats date as dd/mm/yyyy
  };

  const formatDate = (timestamp) => {
    if (timestamp instanceof Timestamp) {
      const date = timestamp.toDate();
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return `${day}/${month}/${year}`; // Changed to a more common format
    }
    return timestamp;
  };

  const fetchItems = async () => {
    const q = query(collection(FIREBASE_DB, "expenses"));
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
    const fetchItems = async () => {
      const q = query(collection(FIREBASE_DB, "expenses"));
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
      console.log("Items fetched and set:", items);
      setLoading(false);
    };
    fetchItems();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }
  if (items.length === 0) {
    return <Text>No expenses found. Add a new expense!</Text>;
  }

  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        <SwipeListView
          data={items}
          renderItem={renderItem}
          renderHiddenItem={renderRightActions}
          rightOpenValue={-75}
          keyExtractor={(item) => item.key}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TextInput
                placeholder="Expense Name"
                value={newExpenseName}
                onChangeText={setNewExpenseName}
                style={styles.input}
              />
              <TextInput
                placeholder="Price"
                value={newExpensePrice}
                onChangeText={setNewExpensePrice}
                style={styles.input}
                keyboardType="numeric"
              />
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={styles.dateButton}
              >
                <Text style={styles.dateButtonText}>
                  {newExpenseDate || "Pick a date"}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  onChange={onChangeDate}
                />
              )}
              <Button title="Save Expense" onPress={handleSaveExpense} />
            </View>
          </View>
        </Modal>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  deleteButton: {
    paddingTop: 30,
    paddingRight: 10,
    marginBottom: 20,
    backgroundColor: "#ff3b30", // Adjusted color to a standard iOS delete red
    alignItems: "flex-end",
    width: "110%", // Match the swipe area width
    height: "100%",
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    alignItems: "center",
    justifyContent: "center", // Adjusted font size for consistency
  },
  itemContainer: {
    borderRightWidth: 0,
    borderLeftWidth: 0,

    flexDirection: "row", // Align items in a row
    padding: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    marginBottom: 10, // Adds space between items
  },
  dateButton: {
    backgroundColor: "lightgray",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
  },
  dateButtonText: {
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "blue",
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 30,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  addButtonText: {
    fontSize: 30,
    color: "white",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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
    marginTop: 100, // Adds space at the top of the screen
  },

  nameText: {
    flex: 1, // Equal width
    fontSize: 20,
    color: "#333",
    textAlign: "left",
  },
  dateText: {
    flex: 1, // Equal width
    fontSize: 20,
    color: "#333",
    textAlign: "center",
  },
  priceText: {
    flex: 1, // Equal width
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "right",
  },
  rowBack: {
    alignItems: "center",
    backgroundColor: "#DDD",
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end", // This aligns the delete button to the right
    paddingLeft: 15,
  },
});

export default Dashboard;
