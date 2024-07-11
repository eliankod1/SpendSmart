import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  StyleSheet,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import {
  addDoc,
  collection,
  getDocs,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { FIREBASE_DB, FIREBASE_AUTH } from "./FirebaseConfig";

const AddExpense = ({ route, navigation }) => {
  const [newExpenseName, setNewExpenseName] = useState("");
  const [newExpensePrice, setNewExpensePrice] = useState("");
  const [newExpenseDate, setNewExpenseDate] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [newExpenseCategory, setNewExpenseCategory] = useState("");
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [expenseType, setExpenseType] = useState("need");
  const [envelopes, setEnvelopes] = useState([]);
  const [selectedEnvelope, setSelectedEnvelope] = useState("");
  const [savingsMethod, setSavingsMethod] = useState("");

  const passedCategory = route.params?.category;

  useEffect(() => {
    const fetchCategoriesAndEnvelopes = async () => {
      const querySnapshot = await getDocs(
        collection(FIREBASE_DB, "categories")
      );
      const categories = querySnapshot.docs.map((doc) => doc.data().name);
      setExpenseCategories(categories);

      const user = FIREBASE_AUTH.currentUser;
      if (user) {
        const envelopesSnapshot = await getDocs(
          collection(FIREBASE_DB, "users", user.uid, "envelopes")
        );
        const envelopesList = envelopesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEnvelopes(envelopesList);

        const userDocRef = doc(FIREBASE_DB, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setSavingsMethod(userDoc.data().savingsMethod);
        }
      }
    };

    fetchCategoriesAndEnvelopes();
  }, []);

  useEffect(() => {
    if (passedCategory) {
      setNewExpenseCategory(passedCategory);
    }
  }, [passedCategory]);

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
    setNewExpenseDate(currentDate.toLocaleDateString("en-GB"));
  };

const handleSaveExpense = async () => {
  const user = FIREBASE_AUTH.currentUser;
  const expenseData = {
    name: newExpenseName,
    price: newExpensePrice,
    date: newExpenseDate,
    category: newExpenseCategory,
    type: expenseType,
    envelope: selectedEnvelope,
    userId: user.uid,
  };
  try {
    await addDoc(collection(FIREBASE_DB, "expenses"), expenseData);
    navigation.goBack();
  } catch (error) {
    console.error("Error adding document: ", error);
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
      <Text style={styles.title}>Dodaj trošak</Text>
      <Text style={styles.descriptionText}>Naziv troška</Text>
      <TextInput
        value={newExpenseName}
        onChangeText={setNewExpenseName}
        style={styles.input}
      />
      {!passedCategory && (
        <>
          <Text style={styles.descriptionText}>Kategorija troška</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={newExpenseCategory}
              onValueChange={(itemValue) => setNewExpenseCategory(itemValue)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              {expenseCategories.map((category) => (
                <Picker.Item key={category} label={category} value={category} />
              ))}
            </Picker>
          </View>
        </>
      )}
      <Text style={styles.descriptionText}>Cijena</Text>
      <TextInput
        value={newExpensePrice}
        onChangeText={setNewExpensePrice}
        style={styles.input}
        keyboardType="numeric"
      />
      <Text style={styles.descriptionText}>Tip troška</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={expenseType}
          onValueChange={(itemValue) => setExpenseType(itemValue)}
          style={styles.picker}
          itemStyle={styles.pickerItem}
        >
          <Picker.Item label="Potrebe" value="need" />
          <Picker.Item label="Želje" value="want" />
          <Picker.Item label="Štednja" value="saving" />
        </Picker>
      </View>
      {savingsMethod === "Envelope" && (
        <>
          <Text style={styles.descriptionText}>Envelope</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedEnvelope}
              onValueChange={(itemValue) => setSelectedEnvelope(itemValue)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              {envelopes.map((envelope) => (
                <Picker.Item
                  key={envelope.id}
                  label={envelope.name}
                  value={envelope.id}
                />
              ))}
            </Picker>
          </View>
        </>
      )}
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={styles.dateButton}
      >
        <Text style={styles.dateButtonText}>
          {newExpenseDate || "Odaberi datum"}
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
      <Button title="Spremi trošak" onPress={handleSaveExpense} />
    </View>
  );
};

const styles = StyleSheet.create({
  descriptionText: {
    fontSize: 18,
    fontWeight: "bold",
    paddingBottom: 10,
    marginTop: "5%",
    textAlign: "left",
  },
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
    marginTop: "20%",
    paddingBottom: "10%",
  },
  input: {
    height: 50,
    borderWidth: 2,
    padding: 10,
    width: "100%",
    borderRadius: 10,
  },
  pickerContainer: {
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 10,
  },
  picker: {
    height: 50,
    width: "100%",
    borderWidth: 2,
    borderColor: "#fff",
    borderRadius: 5,
  },
  pickerItem: {
    textAlign: "center",
  },
  dateButton: {
    backgroundColor: "lightgray",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: "10%",
    marginVertical: "5%",
    width: "100%",
  },
  dateButtonText: {
    fontSize: 16,
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

export default AddExpense;
