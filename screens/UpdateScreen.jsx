/** Importation globale : */
import React from 'react';
import { View, Dimensions, Text, TouchableOpacity, Linking, BackHandler} from 'react-native';
import { Entypo } from 'react-native-vector-icons';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setStateAction } from '../store/ActivityActions';

import { normalize } from "../utils/fonts";

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

class UpdateScreen extends React.Component {

	constructor(props) {
		super(props);

    this.navigation = this.props.navigation;
    this.route = this.props.route;
  }

  backAction = () => {
    BackHandler.exitApp()
    return true;
  };

  componentWillUnmount() {
   this.backHandler.remove();
  }


  async componentDidMount(){

    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );
  }
	_viewMoreOnMaps() {
    const browser_url ="https://buzznobody.herokuapp.com/";
    return Linking.openURL(browser_url);
	}

	render() {
		return (
			<View style={{ width: "100%", height: "100%", backgroundColor: "#FFF", paddingHorizontal: 20, alignItems: "center",  justifyContent: "center" }}>

        <View  style={{ width: "100%", height: "40%", alignItems: "center",  justifyContent: "space-evenly" }}>

          <Entypo name="emoji-sad" size={30} color="#000" style={{ marginLeft: 0, marginRight: -5, }}/>

          <Text style={{width: "60%",textAlign: "center",fontSize: normalize(18), fontWeight: "bold" }}>
            Votre version de CashApp est obsolète !
          </Text>

          <Text style={{ width: "85%", textAlign: "center", fontSize: normalize(15), }}>
						Faites la mise à jour maintenant pour profiter de toutes les fonctionalités de façon optimale
					</Text>

					<TouchableOpacity
            onPress={()=> this._viewMoreOnMaps() }
            style={{
              backgroundColor: "#BB0000",
              width: "100%",
              height:70,
              justifyContent: "center",
              borderRadius: 50,
              borderWidth: 0,
              borderColor: "#000000",
              flexDirection: "column",
							shadowColor: '#BB0000',
							shadowRadius: 0,
							shadowOffset: {
								height: 0,
							},
							elevation: 0,
						}}
          >

            <Text style={{ color: "#FFF", fontSize: normalize(14), textAlign: "center" }}> Mettre à jour CashApp</Text>

          </TouchableOpacity>

				</View>

			</View>
		);

	}

}
export default connect(mapStateToProps, mapDispatchToProps)(UpdateScreen);
