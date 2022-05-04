/** Importation globale : */
import React from 'react';
import { View, Dimensions, Text, TouchableOpacity, BackHandler, Image, TextInput, StyleSheet, ActivityIndicator, Animated } from 'react-native';
import { Entypo, Ionicons, AntDesign } from 'react-native-vector-icons';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setStateAction } from '../store/ActivityActions';

import { normalize } from "../utils/fonts";
import { post, repost, setpost } from "../utils/sender";

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

class UploadScreen extends React.Component {

	constructor(props) {
		super(props);
    this.state= {
      file: {},
      description: "",
      step: 0,
      uri: false,
      loader: false,
    }
    this.navigation = this.props.navigation;
    this.route = this.props.route;
    this.camera = null;
  }


  backAction = () => {
    this.back();
    return true;
  };

  componentWillUnmount() {
   this.backHandler.remove();
  }

  componentDidMount(){

    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );
  }

  back() {
    this.navigation.goBack()
  }
  postter(){
    this.setState({loader: true});
    var data = {
      file: undefined,
      user: this.props.data.user,
      description: this.state.description,
      location: this.props.data.etat.location
    };
    repost(data).then( (response)=> {
      // console.log(response.data);
      console.log(JSON.stringify(response.data));
      this.navigation.reset({ index: 0, routes: [{ name: 'MainNavigator' }]});
    })
    .catch( (error)=> {
      this.setState({loader: false});
      console.log(error);
    });
  }
	render() {
		return (
			<View style={{ width: "100%", height: "100%", backgroundColor: "#FFF", alignItems: "center",  justifyContent: "flex-start", position: "relative" }}>
        <View style={{ width: "95%", height: 50, alignItems: "center", flexDirection: "row", justifyContent: "space-between"}}>
          <TouchableOpacity onPress={()=> this.back()}>
            <Ionicons name="arrow-back" size={30} color="#2F80ED"/>
          </TouchableOpacity>
          
          <Text style={{width: "80%",fontSize: normalize(20), fontWeight: "bold", color: "#000", }}>
            New Poste
          </Text>
        </View>
        <View  style={{ width: "100%", height: "90%", alignItems: "center", justifyContent: "flex-start" }}>

          <TextInput
            style={styles.input}
            onChangeText={(text)=> this.setState({description: text})}
            value={this.state.description}
            multiline={true}
            autoFocus={true}
            textAlignVertical="top"
            keyboardType="default"
            placeholder="Ecrivez votre legende ici ..."
            placeholderTextColor={"#2F80ED"}
          />

          <TouchableOpacity
            onPress={()=> this.postter()}
            style={styles.newpost}
          >

            <Text style={{ color: "#FFF", fontSize: normalize(14), textAlign: "center" }}>
              Publier
            </Text>

          </TouchableOpacity>

        </View>
        { this.state.loader &&
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="F00" />
          </View>
        }
			</View>
		);

	}

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#FFF",
  },
  input: {
    width: "95%",
    height: "20%",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#000",
    marginVertical: "5%",
    color: "#000",
    padding: 10
  },
  newpost: {
    backgroundColor: "#2F80ED",
    width: "95%",
    height:50,
    justifyContent: "center",
    borderRadius: 50,
    marginTop: "10%"
  },
  loader: {
    width: "100%", 
    height: "100%", 
    backgroundColor: "rgba(0, 0, 0, 0.5)", 
    alignItems: "center",  
    justifyContent: "center", 
    position: "absolute", 
    zIndex: 5, 
    top: 0, 
    bottom: 0, 
    left: 0, 
    right: 0 
  }
});
export default connect(mapStateToProps, mapDispatchToProps)(UploadScreen);
