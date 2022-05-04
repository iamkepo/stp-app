import axios from "axios";
import * as FileSystem from 'expo-file-system';

const baseURL = "http://192.168.173.237:3000";
// const baseURL = "https://buzznobody.herokuapp.com";
export function checkversion() {
  return axios({
    method: 'get',
    url: baseURL+"/version/0.0.1",
  })
}

export function getposts(param) {
  return axios({
    method: 'get',
    url: baseURL+"/getposts/"+(param ? param : "all")
  })
}

export function getpost(param) {
  return axios({
    method: 'get',
    url: baseURL+"/getpost/"+param
  })
}

export async function upload({file, user, date}) {
  return await FileSystem.uploadAsync(''+baseURL+'/upload', file.uri, {
    httpMethod: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
      user_id : user._id,
      type : file.type
    },
    sessionType : FileSystem.FileSystemSessionType.BACKGROUND,
    uploadType : FileSystem.FileSystemUploadType.BINARY_CONTENT,
    fieldName : "test",
    mimeType : file.type == 'image' ? "png" : "mp4",
    parameters : "*/*",
  })
}

export async function post({file, user, description}) {
  await upload({file, user})
  .then( (response)=> {
    //console.log(response.body);
    file.uri = JSON.parse(response.body).uri;
    return repost({file, user, description})
  })
  .catch( (error)=> {
    console.log("upload: "+error);
  });
}

export function repost({file, user, description, location}) {
  var data = JSON.stringify({
    "dataSource": "Cluster0",
    "database": "stp",
    "collection": "posts",
    "document": {
      "description": description,
      "location": location,
    }
  });
              
  var config = {
      method: 'post',
      url: 'https://data.mongodb-api.com/app/data-avpsb/endpoint/data/beta/action/insertOne',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Request-Headers': '*',
        'api-key': '62697f1e3de634876cfb4626'
      },
      data : data
  };
              
  
  return axios(config)
}

export function setpost({post_id, option, value}) {
  return axios({
    method: 'post',
    url: baseURL+"/setpost",
    data: {
      post_id : post_id,
      option: option,
      value : value,
    }
  })
}

export function setcomment(param) {
  var data = {
    user : { _id: param.user._id, photo: param.user.photo, psoeudo: param.user.psoeudo },
    post_id : param.post_id,
    comment: param.comment,
    type: param.type
  };
  if (param._id) {
    data._id = param._id
  }
  return axios({
    method: 'post',
    url: baseURL+"/setcomment",
    data: data
  })

}

export function getcomments(param) {
  return axios({
    method: 'get',
    url: baseURL+"/getcomments/"+param
  })
}

export function getusers() {
  return axios({
    method: 'get',
    url: baseURL+"/getusers"
  })
}

export function getuser(param) {
  return axios({
    method: 'get',
    url: baseURL+"/getuser/"+param
  })
}

export function setuser(data) {
  return axios({
    method: 'post',
    url: baseURL+"/setuser",
    data: data
  })
}
