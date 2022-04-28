import React from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { AntDesign, Entypo } from 'react-native-vector-icons';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setStateAction } from '../store/ActivityActions';

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    setStateAction
  }, dispatch)
);

const mapStateToProps = (state) => {
  const { data } = state
  return { data }
};

const screen = Dimensions.get("screen");

function AddPostComponent(props) {

  React.useEffect(() => {
  }, []);

  
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        onPress={()=> props.navigation.navigate("UploadScreen")} 
        style={[styles.newpost, {backgroundColor:"#2F80ED", zIndex: 5,}]}
      >
        <AntDesign name="plus" size={25} color="#FFF"/>
      </TouchableOpacity>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    width: "95%",
    height: 60,
    position: "absolute",
    bottom: 5,
    zIndex: 5,
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: "center",
  },
  newpost: {
    width: 60,
    height: "100%",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2F80ED",
    borderRadius: 50,
    shadowColor: '#000',
    shadowRadius: 5,
    shadowOffset: {
      height: 10,
      width: 10
    },
    shadowOpacity: 0.5,
    elevation : 10,
  }
  
});
export default connect(mapStateToProps, mapDispatchToProps)(AddPostComponent);
