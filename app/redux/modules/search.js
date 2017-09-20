const CHANGE_PLATFORM = "CHANGE_PLATFORM";

export const changePlatform = platform => ({
  type: CHANGE_PLATFORM,
  platform
});

const initialState = {
  platform: "ps4"
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_PLATFORM:
      return {
        ...state
      };
    default:
      return state;
  }
};

console.log("IN REDUX");
console.log(initialState);
console.log(reducer(initialState, changePlatform("ps3")));

export default reducer;
