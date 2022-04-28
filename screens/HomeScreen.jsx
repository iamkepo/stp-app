import React from 'react';
import { StyleSheet, Dimensions, BackHandler, TouchableOpacity, StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Entypo, EvilIcons, AntDesign } from 'react-native-vector-icons';
import { Camera } from 'expo-camera';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setStateAction, getPostsAction } from '../store/ActivityActions';

import { checkversion, getposts } from "../utils/sender";
import { normalize } from "../utils/fonts";

import AddPostComponent from '../components/AddPostComponent';
import CompassComponent from '../components/CompassComponent';
import TrackingComponent from '../components/TrackingComponent';


const mapDispatchToProps = dispatch => (
  bindActionCreators({
    setStateAction,
    getPostsAction
  }, dispatch)
);

const mapStateToProps = (state) => {
  const { data } = state
  return { data }
};

const screen = Dimensions.get("screen");

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};
class HomeScreen extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      refreshing: false,
      ready: true,
      i: 0
    };
    this.navigation = this.props.navigation;
    this.route = this.props.route;
    this.camera = null
  }

  backAction = () => {
    BackHandler.exitApp()
    return true;
  };

  componentWillUnmount() {
   this.backHandler.remove();
  }
  async init(){
    if (this.props.data.user._id == undefined) {
      this.navigation.navigate("StarterScreen");
    } else {
      checkversion().then((response)=>{
        //console.log(response.data.response);
        if (response.data.response == false) {
          this.navigation.navigate("UpdateScreen");
        }else{
          this.onRefresh();
        }
      }).catch((error)=>{
        console.log(error);
      })
    }
  }
  async componentDidMount(){
    //this.init();

    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );
  }

  onRefresh(){
    this.setState({refreshing: true});
    getposts().then((response)=>{
      //console.log(response.data[0]);
      this.props.getPostsAction(response.data);
      this.setState({ready: true});
    }).catch((error)=>{
      console.log(error);
    })
    wait(2000).then(() => this.setState({refreshing: false}));
  };

  render(){
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#FFF" barStyle="dark-content" />

        <View style={styles.boxaction} >
          <TouchableOpacity
            onPress={()=> this.navigation.navigate("ProfileScreen", { user: this.props.data.user })}
            style={styles.profil}
          >
            <AntDesign name="user" size={25} color="#FFF"/>
          </TouchableOpacity>
          <View style={styles.groupicon}>
            
          </View>
        </View>

        <Camera 
          style={{ width: "100%", height: "85%", alignItems: "center", justifyContent: "center" }} 
          type={Camera.Constants.Type.back}
          ratio="4:6"
          ref={ref => {
            this.camera = ref;
          }}
        >
          <CompassComponent />
          <TrackingComponent list={test_posts_list} />
        </Camera>

        <AddPostComponent navigation={this.navigation} />

      </SafeAreaView>
    );
  }
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
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#FFF",
  },
  boxaction: {
    width: "100%",
    height: 50,
    display: "flex",
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: "space-between",
  },
  profil: {
    width: 40,
    height: 40,
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
  },
  groupicon: {
    width: 90,
    height: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: "space-between",
  },
  scrollView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pagerView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: normalize(18),
    color: "#FFF",
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
