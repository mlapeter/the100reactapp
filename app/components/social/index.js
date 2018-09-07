// @flow
import {createStackNavigator, createBottomTabNavigator} from "react-navigation";

import {TabNavigatorOptions, StackNavigatorOptions} from "../components/Navigation";

import Story from "./Story";
import Timeline from "./Timeline";
import Messages from "./Messages";
import Message from "./Message";
import Profile from "./Profile";

const tabs = [
    { key: "Timeline", label: "Timeline", icon: "feed" },
    { key: "Messages", label: "Messages", icon: "message" },
    { key: "Profile", label: "Profile", icon: "account" }
];

const SocialTabNavigator = createBottomTabNavigator({
    Timeline: { screen: Timeline },
    Messages: { screen: Messages },
    Profile: { screen: Profile }
}, TabNavigatorOptions(tabs));

export const SocialNavigator = createStackNavigator({
    Home: { screen: SocialTabNavigator },
    Story: { screen: Story },
    Message: { screen: Message }
}, StackNavigatorOptions);
