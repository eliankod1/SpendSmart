import React, { useState } from "react";
import { View, TouchableOpacity, Text, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FIREBASE_DB, FIREBASE_AUTH } from "./FirebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

const Carousel = () => {
  const navigation = useNavigation();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const items = [
    require("./assets/0-sum.png"),
    require("./assets/50-30-20.png"),
  ];
  const texts = [
    "Cilj ovog načina štednje je da kada se oduzme mjesečni prihod od mjesečnog rashoda ostane 0. Potiče detaljno planiranje proračuna i prioritiziranje troškova tokom mjeseca.",
    "50% prihoda alocira se za osnovne potrebe, stanarinu i slično, 30% alocira se za zabavu i slobodno trošenje dok se 20% prihoda alocira u štednju. ",
  ];

  const handlePrev = () => {
    setSelectedIndex((prevIndex) =>
      prevIndex === 0 ? items.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setSelectedIndex((prevIndex) =>
      prevIndex === items.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleSelect = async () => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
      const userDocRef = doc(FIREBASE_DB, "users", user.uid);
      let savingsMethod;
      switch (selectedIndex) {
        case 0:
          savingsMethod = "ZeroBased";
          break;
        case 1:
          savingsMethod = "50_30_20";
          break;
        default:
          savingsMethod = "";
      }
      await updateDoc(userDocRef, {
        savingsMethod: savingsMethod,
      });
      navigation.navigate("Dashboard");
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
      <View style={styles.carouselContainer}>
        <TouchableOpacity onPress={handlePrev} style={styles.arrowButton}>
          <Text style={styles.arrowText}>{"❮ "}</Text>
        </TouchableOpacity>
        <View style={styles.imageContainer}>
          <Image source={items[selectedIndex]} style={styles.image} />
        </View>
        <TouchableOpacity onPress={handleNext} style={styles.arrowButton}>
          <Text style={styles.arrowText}>{"❯"}</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.text}>{texts[selectedIndex]}</Text>
      <TouchableOpacity onPress={handleSelect} style={styles.selectButton}>
        <Text style={styles.selectText}>Odaberi</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: "5%",
  },
  carouselContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "15%",
  },
  arrowButton: {
    paddingHorizontal: "1%",
  },
  arrowText: {
    fontSize: 35,
    fontWeight: "bold",
  },
  imageContainer: {
    borderWidth: 3,
    borderColor: "grey",
    padding: "5%",
    marginHorizontal: "5%",
    flex: 1,
    borderRadius: 20,
    aspectRatio: 1,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  text: {
    marginBottom: "15%",
    marginHorizontal: "5%",
    fontSize: 20,
    textAlign: "center",
  },
  selectText: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  selectButton: {
    backgroundColor: "#36A4F4",
    paddingVertical: "4%",
    paddingHorizontal: "10%",
    borderRadius: 15,
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

export default Carousel;
