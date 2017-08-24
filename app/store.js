"use strict";

// Redux
import { applyMiddleware, combineReducers, createStore } from "redux";
import logger from "redux-logger";

// Navigation
import { GamingSessionsListNavigator } from "./components/GamingSessionsList/NavigationConfiguration";
import { GroupNavigator } from "./components/Group/NavigationConfiguration";
import { NotificationsNavigator } from "./components/Notifications/NavigationConfiguration";
import { FriendsNavigator } from "./components/Friends/NavigationConfiguration";

import {
  TabBar,
  tabBarReducer
} from "./components/TabBar/NavigationConfiguration";

// Middleware
const middleware = () => {
  return applyMiddleware(logger);
};

export default createStore(
  combineReducers({
    tabBar: tabBarReducer,

    gamingSessionsListTab: (state, action) =>
      GamingSessionsListNavigator.router.getStateForAction(action, state),

    groupTab: (state, action) =>
      GroupNavigator.router.getStateForAction(action, state),

    notificationsTab: (state, action) =>
      NotificationsNavigator.router.getStateForAction(action, state),

    friendsTab: (state, action) =>
      FriendsNavigator.router.getStateForAction(action, state)
    //
    // tabThree: (state, action) =>
    //   NavigatorTabThree.router.getStateForAction(action, state)
  }),
  middleware()
);
