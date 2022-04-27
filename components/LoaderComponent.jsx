/** Importation globale : */
import React from 'react';
import { View, Dimensions, TouchableOpacity, Animated } from 'react-native';
import { Entypo} from 'react-native-vector-icons';


const screen = Dimensions.get("screen");

export default function LoaderComponent (props) {
  const [click, setclick] = React.useState(false);
  const loader = React.useMemo(() => new Animated.Value(-screen.width), []);

  const startAnime = () => {
    setclick(true)
    Animated.timing(loader, { toValue: 0, duration: 30000, useNativeDriver: true }).start();
    props.runCamera()
  }
  return(
    <View style={{width: "100%", height: 80, alignItems: "center", justifyContent: "space-between"}}>
      <Animated.View style={{width: "100%", height: 5 , backgroundColor:"#F00", transform: [{translateX: loader}] }}/>
      <TouchableOpacity 
        onPressIn={()=> startAnime()}
        onPressOut={()=> {setclick(false); props.stopCamera()}}
        style={{width: 60, height: 60, alignItems: "center", justifyContent: "center", backgroundColor: "#FFF", borderRadius: 50, borderColor:"#F00", borderWidth: 3}}
      >
        <Entypo name="video-camera" size={25} color="#000"/>
      </TouchableOpacity>
    </View>
  )
}