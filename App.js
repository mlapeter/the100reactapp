import App from "./app/index";

import Sentry from "sentry-expo";
// import { SentrySeverity, SentryLog } from 'react-native-sentry';

Sentry.config(
  "https://e31940dc9e154c32a90361469fb159d0@sentry.io/1259554"
).install();

if (__DEV__) {
  require("./app/config/reactotron");

  const Reactotron = require("reactotron-react-native").default;
  Reactotron.log("Hello world");
}

export default App;
