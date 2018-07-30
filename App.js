import App from "./app/index";

if (__DEV__) {
  require("./app/config/reactotron");

  const Reactotron = require("reactotron-react-native").default;
  Reactotron.log("Hello world");
}

export default App;
