import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Accelerometer, Gyroscope, Magnetometer  } from 'expo-sensors';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';

export default function AccelerometerComponent(props) {
  const [location, setLocation] = React.useState({
    accuracy: 0,
    altitude: 0,
    altitudeAccuracy: 0,
    heading: 0,
    latitude: 0,
    longitude: 0,
    speed: 0,
  });
  const [data, setData] = useState({x: 0,y: 0,z: 0,});
  const [subscription, setSubscription] = useState(null);
  const [list, setlist] = useState([]);

  const _subscribe = () => {
    setSubscription(
      Magnetometer.addListener(magnetometerData  => {
        setData(magnetometerData );
        addLocation()
      })
    );
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  useEffect(() => {
    _subscribe();
    Magnetometer.setUpdateInterval(1000);
    return () => _unsubscribe();
  }, []);
  const addLocation=async ()=>{
    let { status } = await Location.requestForegroundPermissionsAsync();
    let location = await Location.getCurrentPositionAsync({}).then((response)=>{
      if (response != undefined) {
        setLocation(response.coords);
        //console.log(response);
        props.list.forEach(item => {
          item.distance = getDistance(
            { latitude: item.coords.latitude, longitude: item.coords.longitude },
            { latitude: response.coords.latitude, longitude: response.coords.longitude }
          );
        });
        setlist(props.list)
      } else {
        addLocation();
      }
    }).catch(()=>{
      addLocation();
    });
  }

  const { x, y, z } = data;
  const {accuracy, altitude, altitudeAccuracy, heading, latitude, longitude, speed} = location;
  return (
    <View style={styles.container}>
      
      <Text style={styles.text}>x: {x}</Text>

      <Text style={styles.text}>y: {y}</Text>

      <Text style={styles.text}>z: {z}</Text>

      <View style={styles.boxContainer}>
        
        <Text style={styles.text}>accuracy: {accuracy}</Text>

        <Text style={styles.text}>altitude: {altitude}</Text>

        <Text style={styles.text}>altitudeAccuracy: {altitudeAccuracy}</Text>

        <Text style={styles.text}>heading: {heading}</Text>

        <Text style={styles.text}>latitude: {latitude}</Text>

        <Text style={styles.text}>longitude: {longitude}</Text>

        <Text style={styles.text}>speed: {speed}</Text>

      </View>
        <View style={styles.box}>
        {
          list.map((item, i)=>(
            <Text style={{color: "#000"}} key={i}>{item.boite} : {item.distance}</Text>
          ))
        }
        </View>
      
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