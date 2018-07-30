import Reactotron from "reactotron-react-native";

import host from "./host";

Reactotron.configure({ host }) // controls connection & communication settings
  .useReactNative() // add all built-in react native plugins
  .connect(); // let's connect!
