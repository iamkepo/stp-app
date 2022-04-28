import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Magnetometer } from 'expo-sensors';

export default function CompassComponent() {
  const [data, setData] = useState({x: 0,y: 0,z: 0,});
  const [subscription, setSubscription] = useState(null);

  const _subscribe = () => {
    setSubscription(
      Magnetometer.addListener(result => {
        setData(result);
      })
    );
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  useEffect(() => {
    _subscribe();
    Magnetometer.setUpdateInterval(500);
    return () => _unsubscribe();
  }, []);


  const { x, y, z } = data;
 
  return (
    <View style={styles.container}>
      
      <Text style={styles.text}>x: {x}</Text>

      <Text style={styles.text}>y: {y}</Text>

      <Text style={styles.text}>z: {z}</Text>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  text: {
    color: "#FFF"
  },
  boxContainer: {
    marginTop: 15,
    backgroundColor: '#000',
    padding: 10,
  },
  box: {
    justifyContent: 'center',
    backgroundColor: '#eee',
    padding: 10,
  },
});