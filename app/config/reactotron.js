import Reactotron from "reactotron-react-native";
import sagaPlugin from "reactotron-redux-saga";

import host from "./host";

Reactotron.configure({ host }) // controls connection & communication settings
  .useReactNative()
  .use(sagaPlugin()) // add all built-in react native plugins
  .connect(); // let's connect!
