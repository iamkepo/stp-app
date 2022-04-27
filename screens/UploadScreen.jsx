/** Importation globale : */
import React from 'react';
import { View, Dimensions, Text, TouchableOpacity, BackHandler, Image, TextInput, StyleSheet, ActivityIndicator, Animated } from 'react-native';
import { Entypo, Ionicons, AntDesign } from 'react-native-vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { Camera } from 'expo-camera';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setStateAction } from '../store/ActivityActions';

import { normalize } from "../utils/fonts";
import { post, repost, setpost } from "../utils/sender";


import LoaderComponent from "../components/LoaderComponent";

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
      cameraOriantation: Camera.Constants.Type.back
    }
    this.navigation = this.props.navigation;
    this.route = this.props.route;
    this.camera = null;
  }

  generateThumbnail = async () => {
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(
        this.route.params.post.uri,
        { time: 1 }
      );
      this.setState({uri: uri});
    } catch (e) {
      this.generateThumbnail()
    }
  };

  backAction = () => {
    this.back();
    return true;
  };

  componentWillUnmount() {
   this.backHandler.remove();
  }

  async init(){
    if (this.route.params.post.uri != undefined) {
      this.setState({
        file: this.route.params.post,
        description: this.route.params.post.description,
        step: 2
      });
      if (this.route.params.post.type == "video") {
        this.generateThumbnail();
      }
    } else {
      switch (this.route.params.post.type) {
        case "picture":
          this.pickImage(ImagePicker.MediaTypeOptions.Images);
          this.setState({step: 1});
          break;

        case "video":
          this.pickImage(ImagePicker.MediaTypeOptions.Videos);
          this.setState({step: 1});
          break;
      
        default:
          const { status } = await Camera.requestCameraPermissionsAsync();
          const { status1 } = await Camera.requestMicrophonePermissionsAsync();
          this.setState({step: 0});
          break;
      }
    }
  }
  componentDidMount(){
    //console.log(this.route.params.post);
    
    this.init();

    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );
  }

  runCamera = async () => {
    if (this.camera) {
      let video = await this.camera.recordAsync({maxDuration: 30});
      //console.log(video);
      this.setState({loader: true});
      video.type = "video";
      this.setState({file: video, step: 1, loader: false})
    }
  }
  snap = async () => {
    if (this.camera) {
      this.setState({loader: true});
      let photo = await this.camera.takePictureAsync();
      //console.log(photo);
      photo.type = "image";
      this.setState({file: photo, step: 1, loader: false})
    }
  };
  async pickImage(type) {
    let photo = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: type,
      allowsEditing: false,
      quality: 1,
    });

    //console.log(photo);
    if (photo.cancelled == false) {
      this.setState({file: photo})
    }

  };

  back() {
    if (this.state.step > 0) {
      if (this.state.step == 1 && 
        (this.route.params.post.type == "picture" || 
        this.route.params.post.type == "video" ||
        this.route.params.post.type == "image")) {
        this.navigation.goBack()
      }else{this.setState({step: this.state.step-1})}
    } else {
      this.navigation.goBack()
    }
  }
  postter(){
    this.setState({loader: true});
    var data = {
      file: this.state.file,
      user: this.props.data.user,
      description: this.state.description,
    };
    if (this.state.file.uri[0] != "h") {
      post(data).then( (response)=> {
        // console.log(response.data);
        this.navigation.reset({ index: 0, routes: [{ name: 'MainNavigator' }]});
      })
      .catch( (error)=> {
        console.log("post: "+error);
      });
    } else {
      repost(data).then( (response)=> {
        //console.log(response.data);
        setpost({ post_id: this.route.params.post._id, option: "share", value: this.props.data.user._id});
        this.navigation.reset({ index: 0, routes: [{ name: 'MainNavigator' }]});
      })
      .catch( (error)=> {
        console.log("repost: "+error);
      });
    }

  }
	render() {
		return (
			<View style={{ width: "100%", height: "100%", backgroundColor: "#000", alignItems: "center",  justifyContent: "flex-start", position: "relative" }}>
        <View style={{ width: "95%", height: 50, alignItems: "center", flexDirection: "row", justifyContent: "space-between"}}>
          <TouchableOpacity onPress={()=> this.back()}>
            <Ionicons name="arrow-back" size={30} color="#FFF"/>
          </TouchableOpacity>
          
          <Text style={{width: "80%",fontSize: normalize(20), fontWeight: "bold", color: "#FFF", }}>
            New Poste
          </Text>
        </View>
        {
          this.state.step == 0 &&
          <View style={{ width: "100%", height: "90%", alignItems: "center", justifyContent: "space-between" }}>
            <Camera 
              style={{ width: "100%", height: "90%", alignItems: "center", justifyContent: "center" }} 
              type={this.state.cameraOriantation}
              ratio="4:6"
              ref={ref => {
                this.camera = ref;
              }}
            >
              <TouchableOpacity
                style={{width: "100%", height: "100%"}}
                onPress={() => {
                  this.setState({cameraOriantation:
                    this.state.cameraOriantation === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back
                  });
                }}>
              </TouchableOpacity>
            </Camera>
            { this.route.params.post.type == "camera" &&
              <TouchableOpacity 
                onPress={()=> this.snap()} 
                style={{width: 60, height: 60, alignItems: "center", justifyContent: "center", backgroundColor: "#FFF", borderRadius: 50, borderColor:"#F00", borderWidth: 3 }}
              >
                <Entypo name="camera" size={25} color="#000"/>
              </TouchableOpacity>
            }
            { this.route.params.post.type == "video-camera" &&
              <LoaderComponent runCamera={()=> this.runCamera()} stopCamera={()=> this.camera.stopRecording()} />
            }
          </View>
        }
        {
          this.state.step == 1 &&
          <View  style={{ width: "100%", height: "90%", alignItems: "center", justifyContent: "flex-start" }}>

            <TouchableOpacity onPress={()=> this.init()}  style={styles.cadre}>
              {
                (this.state.file.uri != undefined || this.state.uri) ?
                <Image
                  source={{ uri: this.state.uri ? this.state.uri : this.state.file.uri  }}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="contain"
                />
                :
                <AntDesign name="picture" size={25} color="#FFF"/>
              }
            </TouchableOpacity>

            <TouchableOpacity
              disabled={this.state.file.uri != undefined ? false : true}
              onPress={()=> this.setState({step: 2})}
              style={{
                backgroundColor: this.state.file.uri != undefined ? "#BB0000" : "#555",
                width: "95%",height:50,justifyContent: "center",borderRadius: 50,marginTop: "15%"
              }}
            >
              <Text style={{ color: "#FFF", fontSize: normalize(14), textAlign: "center" }}>Suivant</Text>
            </TouchableOpacity>

          </View>
        }
        {
          this.state.step == 2 &&
          <View  style={{ width: "100%", height: "90%", alignItems: "center", justifyContent: "flex-start" }}>

            <Text style={{width: "95%", marginVertical: "5%", textAlign: "center",fontSize: normalize(18), fontWeight: "bold", color: "#FFF", }}>
              Cliquer dans le champ pour ajouter une description
            </Text>

            <TextInput
              style={styles.input}
              onChangeText={(text)=> this.setState({description: text})}
              value={this.state.description}
              multiline={true}
              autoFocus={true}
              textAlignVertical="top"
              keyboardType="default"
              placeholder="Ecrivez votre legende ici ..."
              placeholderTextColor={"#FFF"}
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
        }
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
    backgroundColor: "#000",
  },
  cadre: {
    width: "95%",
    height: "60%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FFF",
    marginVertical: "5%",
    overflow: "hidden"
  },
  input: {
    width: "95%",
    height: "20%",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FFF",
    marginVertical: "5%",
    color: "#FFF",
    padding: 10
  },
  newpost: {
    backgroundColor: "#BB0000",
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
