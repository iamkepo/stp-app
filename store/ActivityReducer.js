import { combineReducers } from 'redux';

const INITIAL_STATE = {
  user: {},
  etat: {
    bgcolor: "#000",
    textcolor: "#FFF",
    theme: "#F00"
  },
  posts: []
};

function monReducer (state = INITIAL_STATE, action) {
  let nextState
  switch(action.type) {

    case 'STATE':

      state.etat[action.payload.index] = action.payload.value;

      nextState = {
          ...state,
          etat: state.etat
      }
    return nextState;

    case 'USER':

      state.user = action.payload;

      nextState = {
          ...state,
          user: state.user
      }

    return nextState;

    case 'GETPOSTS':

      state.posts = action.payload;

      nextState = {
          ...state,
          posts: state.posts
      }

    return nextState

    case 'SETPOST':

      state.posts[action.index] = action.value;

      nextState = {
          ...state,
          posts: state.posts
      }

    return nextState

    //...
    default:
      return state
  }
}

export default combineReducers({
  data: monReducer
});
