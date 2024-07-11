import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ProgressBarAndroid,
} from "react-native";
import { FIREBASE_DB, FIREBASE_AUTH } from "./FirebaseConfig";
import {
  doc,
  updateDoc,
  getDoc,
  collection,
  addDoc,
  getDocs,
} from "firebase/firestore";

const Envelope = ({ navigation }) => {
  const [budget, setBudget] = useState(0);
  const [envelopes, setEnvelopes] = useState([]);
  const [newEnvelopeName, setNewEnvelopeName] = useState("");
  const [newEnvelopeAmount, setNewEnvelopeAmount] = useState("");

  useEffect(() => {
    const fetchBudgetAndEnvelopes = async () => {
      const user = FIREBASE_AUTH.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(FIREBASE_DB, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setBudget(data.budget || 0);
          const envelopesSnapshot = await getDocs(
            collection(FIREBASE_DB, "users", user.uid, "envelopes")
          );
          const envelopesList = await Promise.all(
            envelopesSnapshot.docs.map(async (doc) => {
              const envelopeData = doc.data();
              const expensesSnapshot = await getDocs(
                collection(
                  FIREBASE_DB,
                  "users",
                  user.uid,
                  "envelopes",
                  doc.id,
                  "expenses"
                )
              );
              const totalSpent = expensesSnapshot.docs.reduce(
                (sum, expenseDoc) => {
                  return sum + parseFloat(expenseDoc.data().price);
                },
                0
              );
              console.log(
                `Envelope: ${envelopeData.name}, Total Spent: ${totalSpent}`
              );
              return {
                id: doc.id,
                ...envelopeData,
                spent: totalSpent,
              };
            })
          );
          setEnvelopes(envelopesList);
        }
      }
    };
    fetchBudgetAndEnvelopes();
  }, []);

  const handleSaveBudget = async () => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
      const userDocRef = doc(FIREBASE_DB, "users", user.uid);
      await updateDoc(userDocRef, { budget: Number(budget) });
    }
  };

  const handleAddEnvelope = async () => {
    const user = FIREBASE_AUTH.currentUser;
    if (user && newEnvelopeName && newEnvelopeAmount) {
      const envelopeData = {
        name: newEnvelopeName,
        amount: Number(newEnvelopeAmount),
        spent: 0,
      };
      const docRef = await addDoc(
        collection(FIREBASE_DB, "users", user.uid, "envelopes"),
        envelopeData
      );
      const newEnvelope = { id: docRef.id, ...envelopeData };
      setEnvelopes([...envelopes, newEnvelope]);
      setNewEnvelopeName("");
      setNewEnvelopeAmount("");
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
      <Text style={styles.title}>Način štednje omotnicama</Text>
      <Text style={styles.budgetText}>Budget: {budget} €</Text>
      <TextInput
        value={String(budget)}
        onChangeText={setBudget}
        style={styles.input}
        placeholder="Set Maximum Budget"
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveBudget}>
        <Text style={styles.saveButtonText}>Spremi budžet</Text>
      </TouchableOpacity>
      <TextInput
        value={newEnvelopeName}
        onChangeText={setNewEnvelopeName}
        style={styles.input}
        placeholder="Ime omotnice"
      />
      <TextInput
        value={newEnvelopeAmount}
        onChangeText={setNewEnvelopeAmount}
        style={styles.input}
        placeholder="Maksimalna vrijednost omotnice"
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddEnvelope}>
        <Text style={styles.addButtonText}>Dodaj omotnicu</Text>
      </TouchableOpacity>
      <FlatList
        data={envelopes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.envelopeContainer}>
            <Text style={styles.envelopeText}>
              {item.name}: {item.spent}/{item.amount}
            </Text>
            <ProgressBarAndroid
              styleAttr="Horizontal"
              indeterminate={false}
              progress={item.spent / item.amount}
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    textAlign: "center",
    fontSize: 35,
    fontWeight: "bold",
    marginTop: 40,
    marginBottom: 20,
  },
  budgetText: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderWidth: 2,
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: "#36A4F4",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  saveButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#36A4F4",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  addButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  envelopeContainer: {
    marginBottom: 20,
  },
  envelopeText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
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

export default Envelope;
