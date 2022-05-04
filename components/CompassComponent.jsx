import React, { useState, useEffect } from 'react';
import { Image, View, Text, Dimensions } from 'react-native';
import { Grid, Col, Row } from 'react-native-easy-grid';
import { Magnetometer } from 'expo-sensors';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setStateAction } from '../store/ActivityActions';

import TrackingComponent from '../components/TrackingComponent';

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    setStateAction
  }, dispatch)
);

const mapStateToProps = (state) => {
  const { data } = state
  return { data }
};
const { height, width } = Dimensions.get('window');

const CompassComponent = (props) => {

  const [subscription, setSubscription] = useState(null);
  const [magnetometer, setMagnetometer] = useState(0);

  useEffect(() => {
    _toggle();
    return () => {
      _unsubscribe();
    };
  }, []);

  const _toggle = () => {
    if (subscription) {
      _unsubscribe();
    } else {
      _subscribe();
    }
  };

  const _subscribe = () => {
    setSubscription(
      Magnetometer.addListener((data) => {
        setMagnetometer(_angle(data));
      })
    );
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  const _angle = (magnetometer) => {
    let angle = 0;
    if (magnetometer) {
      let { x, y, z } = magnetometer;
      if (Math.atan2(y, x) >= 0) {
        angle = Math.atan2(y, x) * (180 / Math.PI);
      } else {
        angle = (Math.atan2(y, x) + 2 * Math.PI) * (180 / Math.PI);
      }
    }
    return Math.round(angle);
  };

  const _direction = (degree) => {
    if (degree >= 22.5 && degree < 67.5) {
      return 'NE';
    }
    else if (degree >= 67.5 && degree < 112.5) {
      return 'E';
    }
    else if (degree >= 112.5 && degree < 157.5) {
      return 'SE';
    }
    else if (degree >= 157.5 && degree < 202.5) {
      return 'S';
    }
    else if (degree >= 202.5 && degree < 247.5) {
      return 'SW';
    }
    else if (degree >= 247.5 && degree < 292.5) {
      return 'W';
    }
    else if (degree >= 292.5 && degree < 337.5) {
      return 'NW';
    }
    else {
      return 'N';
    }
  };

  const _degree = (magnetometer) => {
    return magnetometer - 90 >= 0 ? magnetometer - 90 : magnetometer + 271;
  };

  return (

    <Grid 
      style={{ 
        width: "100%", 
        height: "100%", 
        position: "absolute", 
        zIndex:6,
      }}
    >
      <Row style={{ alignItems: 'center' }} size={.9}>
        <Col style={{ alignItems: 'center' }}>
          <TrackingComponent list={test_posts_list} orientation={_direction(_degree(magnetometer))} />
        </Col>
      </Row>

      <Row style={{ alignItems: 'center' }} size={.1}>
        <Col style={{ alignItems: 'center' }}>
          <View style={{ position: 'absolute', width: width, alignItems: 'center', top: 0 }}>
            <Image source={require('../assets/compass_pointer.png')} style={{
              height: height / 26,
              resizeMode: 'contain'
            }} />
          </View>
        </Col>
      </Row>

      <Row style={{ alignItems: 'center' }} size={2}>
        <Text style={{
          color: '#fff',
          fontSize: height / 27,
          width: width,
          position: 'absolute',
          textAlign: 'center'
        }}>
          {_degree(magnetometer)}°
          </Text>

        <Col style={{ alignItems: 'center' }}>

          <Image source={require("../assets/compass_bg.png")} style={{
            height: width - 80,
            justifyContent: 'center',
            alignItems: 'center',
            resizeMode: 'contain',
            transform: [{ rotate: 360 - magnetometer + 'deg' }]
          }} />

        </Col>
      </Row>

   

    </Grid>

  );
}

const test_posts_list = [
  {
    coords: {
      accuracy: 21.600000381469727,
      altitude: 29.399999618530273,
      altitudeAccuracy: 3.396122455596924,
      heading: 0,
      latitude: 6.377897,
      longitude: 2.4608071,
      speed: 0,
    },
    boite: "avant",
    mocked: false,
    timestamp: 1651051280837,
  },
  {
    coords: {
      accuracy: 20,
      altitude: 29.399999618530273,
      altitudeAccuracy: 2.21551775932312,
      heading: 263.7195129394531,
      latitude: 6.3778964,
      longitude: 2.4608012,
      speed: 0.06779343634843826,
    },
    boite: "centre",
    mocked: false,
    timestamp: 1651051288709,
  },
  {
    coords: {
      accuracy: 20.100000381469727,
      altitude: 29.399999618530273,
      altitudeAccuracy: 2.958400011062622,
      heading: 0,
      latitude: 6.3778969,
      longitude: 2.4608033,
      speed: 0,
    },
    boite: "arrière",
    mocked: false,
    timestamp: 1651051382473,
  },
  {
    coords: {
      accuracy: 20,
      altitude: 29.399999618530273,
      altitudeAccuracy: 2.21551775932312,
      heading: 0,
      latitude: 6.3778963,
      longitude: 2.4608,
      speed: 0,
    },
    boite: "cote",
    mocked: false,
    timestamp: 1651051410904,
  },
]
export default connect(mapStateToProps, mapDispatchToProps)(CompassComponent);