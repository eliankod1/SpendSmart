import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Carousel = () => {
  const navigation =  useNavigation();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const items = [
    require('./assets/0-sum.png'), // Replace with the path to your image file
    require('./assets/50-30-20.png'), // Replace with the path to your image file
    require('./assets/envelope.png'), // Replace with the path to your image file
  ];
  const texts = [
    "Cilj ovog načina štednje je da kada se oduzme mjesečni prihod od mjesečnog rashoda ostane 0. Potiče detaljno planiranje proračuna i prioritiziranje troškova tokom mjeseca.", // Text corresponding to the first image
    "50% prihoda alocira se za osnovne potrebe, stanarinu i slično, 30% alocira se za zabavu i slobodno trošenje dok se 20% prihoda alocira u štednju. ", // Text corresponding to the second image
    "Prihod se raspoređuje u virtualne omotnice prema različitim kategorijama troškova, poput hrane, režija, zabave i slično kako bi se povećala kontrola nad troškovima.", // Text corresponding to the third image
  ];

  const handlePrev = () => {
    setSelectedIndex((prevIndex) => (prevIndex === 0 ? items.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prevIndex) => (prevIndex === items.length - 1 ? 0 : prevIndex + 1));
  };

  const handleSelect = () => {
    // Do something with the selected item, like navigate to another screen
    console.log('Selected item:', items[selectedIndex]);
    navigation.navigate("Dashboard");
    
  };

  return (
    <View style={styles.container}>
      <View style={styles.carouselContainer}>
        <TouchableOpacity onPress={handlePrev} style={styles.arrowButton}>
          <Text style={styles.arrowText}>{'❮ '}</Text>
        </TouchableOpacity>
        <View style={styles.imageContainer}>
          <Image source={items[selectedIndex]} style={styles.image} />
        </View>
        <TouchableOpacity onPress={handleNext} style={styles.arrowButton}>
          <Text style={styles.arrowText}>{'❯'}</Text>
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: '5%',
  },
  carouselContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '15%',
  },
  arrowButton: {
    paddingHorizontal: '1%',
  },
  arrowText: {
    fontSize: 35,
    fontWeight: 'bold',
  },
  imageContainer: {
    borderWidth: 3,
    borderColor: 'grey',
    padding: '5%',
    marginHorizontal: '5%',
    flex: 1,
    borderRadius: 20,
    aspectRatio: 1, // Aspect ratio of 1:1
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  text: {
    marginBottom: '15%',
    marginHorizontal: '5%', // Style for the text
    fontSize: 20,
    textAlign: 'center',
  },
  selectText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  selectButton: {
    backgroundColor: '#36A4F4',
    paddingVertical: '4%',
    paddingHorizontal: '10%',
    borderRadius: 15,
  },
});

export default Carousel;