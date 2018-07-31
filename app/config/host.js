import { NativeModules } from "react-native";
import url from "url";

const { hostname } = url.parse(NativeModules.SourceCode.scriptURL);

export default hostname;
