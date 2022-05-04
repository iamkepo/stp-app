import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Location from 'expo-location';
import { getDistance, getCompassDirection } from 'geolib';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setStateAction } from '../store/ActivityActions';
import { transform } from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes';

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    setStateAction
  }, dispatch)
);

const mapStateToProps = (state) => {
  const { data } = state
  return { data }
};

function TrackingComponent(props) {
  const [position, setposition] = useState([]);
  const [list, setlist] = useState([]);

  useEffect(async() => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    var loc = Location.watchPositionAsync({
      accuracy: Location.Accuracy.Highest,
      distanceInterval: 1,
      timeInterval: 100,
      mayShowUserSettingsDialog: true
    }, (response) => {
      finder(response.coords);
      props.setStateAction("location", response);
    });
    return async () => await loc.remove();
  }, []);

  const finder =  async (coords)=>{
    props.list.forEach(item => {
      item.distance = getDistance(coords, item.coords);
      item.compass = getCompassDirection(coords, item.coords)
    });
    setlist(props.list.sort(function(a, b){return a.distance - b.distance }))
  }

  return (
    <View style={styles.container}>
        <Text style={{color: "#FFF"}}>{position}</Text>

      <View style={styles.boxcontainer}>
        {
          list.map((item, i)=>(
            item.compass.search(props.orientation) != -1 ?
            <TouchableOpacity 
              style={[
                styles.box, 
                {
                  zIndex: list.length,
                  //transform: [{translateY}]
                },
              ]} 
              key={i}
            >
              <Text style={styles.text}>
                {item.boite} : {item.distance} {" -> "} {item.compass} - {i}
              </Text>
            </TouchableOpacity>
            : false
          ))
        }
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
  boxcontainer: {
    width: "100%",
    height: "100%",
    alignItems: 'center',
    justifyContent: 'center',
    position: "relative",
  },
  box: {
    position: "absolute",
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#eee',
    shadowColor: '#2F80ED',
    shadowRadius: 5,
    shadowOffset: {
      height: 10,
      width: 10
    },
    shadowOpacity: 0.5,
    elevation : 10,
  },
  text: {
    color: "#000",
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(TrackingComponent);