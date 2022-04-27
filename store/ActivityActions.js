export const setStateAction = index => (
  {
    type: 'STATE',
    payload: index,
  }
);
export const userAction = index => (
  {
    type: 'USER',
    payload: index
  }
);
export const getPostsAction = index => (
  {
    type: 'GETPOSTS',
    payload: index,
  }
);
export const setPostAction = (index, value) => (
  {
    type: 'SETPOST',
    index: index,
    value: value
  }
);

