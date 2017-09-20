"use strict";

// Redux
import { applyMiddleware, combineReducers, createStore, compose } from "redux";
import logger from "redux-logger";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

// Navigation
import { GamingSessionsListNavigator } from "./components/GamingSessionsList/NavigationConfiguration";
import { GroupNavigator } from "./components/Group/NavigationConfiguration";
import { NotificationsNavigator } from "./components/Notifications/NavigationConfiguration";
import { FriendsListNavigator } from "./components/FriendsList/NavigationConfiguration";

import {
  TabBar,
  tabBarReducer
} from "./components/TabBar/NavigationConfiguration";

import { authentication } from "./redux/modules/authentication";
import { search } from "./redux/modules/search";

// Middleware
const middleware = () => {
  return applyMiddleware(logger, thunk);
};

export default createStore(
  combineReducers({
    tabBar: tabBarReducer,
    authentication: authentication,
    search: search,

    gamingSessionsListTab: (state, action) =>
      GamingSessionsListNavigator.router.getStateForAction(action, state),

    groupTab: (state, action) =>
      GroupNavigator.router.getStateForAction(action, state),

    notificationsTab: (state, action) =>
      NotificationsNavigator.router.getStateForAction(action, state),

    friendsTab: (state, action) =>
      FriendsListNavigator.router.getStateForAction(action, state)
    //
    // tabThree: (state, action) =>
    //   NavigatorTabThree.router.getStateForAction(action, state)
  }),
  composeWithDevTools(middleware())
);
