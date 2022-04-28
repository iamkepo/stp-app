import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Location from 'expo-location';
import { getDistance, getCompassDirection } from 'geolib';

let client = {
  user: {},
  location: null
};

export default function TrackingComponent(props) {
  const [location, setLocation] = React.useState({
    accuracy: 0,
    altitude: 0,
    altitudeAccuracy: 0,
    heading: 0,
    latitude: 0,
    longitude: 0,
    speed: 0,
  });
  const [list, setlist] = useState([]);

  useEffect(async() => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    var loc = Location.watchPositionAsync({
      accuracy: Location.Accuracy.Highest,
      distanceInterval: 1,
      timeInterval: 5000,
    }, (response) => {
      //console.log(response.coords)
      addLocation(response.coords)
    });
    return async () => await location.remove();
  }, []);

  const addLocation =  async (coords)=>{
    setLocation(coords),
    props.list.forEach(item => {
      item.distance = getDistance(coords, item.coords);
      item.compass = getCompassDirection(coords, item.coords)
    });
    setlist(props.list.sort(function(a, b){return a.distance - b.distance }))
  }
  const getDirection = (coords1, coords2) => {
    var PI = Math.PI;
    var dTeta = Math.log(Math.tan((coords2.latitude/2)+(PI/4))/Math.tan((coords1.latitude/2)+(PI/4)));
    var dLon = Math.abs(coords1.longitude-coords2.longitude);
    var teta = Math.atan2(dLon,dTeta);
    var direction = Math.round((teta * 180 / Math.PI));
    return direction;
  }
  const {accuracy, altitude, altitudeAccuracy, heading, latitude, longitude, speed} = location;
  return (
    <View style={styles.container}>

      <View style={styles.box}>
        {
          list.map((item, i)=>(
            <Text style={{color: "#000"}} key={i}>
              {item.boite} : {item.distance} {" -> "} {item.compass}
            </Text>
          ))
        }
      </View>

      <View style={styles.boxContainer}>
        

        <Text style={styles.text}>accuracy: {accuracy}</Text>

        <Text style={styles.text}>altitude: {altitude}</Text>

        <Text style={styles.text}>altitudeAccuracy: {altitudeAccuracy}</Text>

        <Text style={styles.text}>heading: {heading}</Text>

        <Text style={styles.text}>latitude: {latitude}</Text>

        <Text style={styles.text}>longitude: {longitude}</Text>

        <Text style={styles.text}>speed: {speed}</Text>

      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowRadius: 5,
    shadowOffset: {
      height: 10,
      width: 10
    },
    shadowOpacity: 0.5,
    elevation : 10,
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