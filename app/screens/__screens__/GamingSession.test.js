import React from "react";
import { shallow } from "enzyme";
import configureStore from "redux-mock-store";

import GamingSession from "../GamingSession";
import { initialState as gamingSessionsInitialState } from "../../reducers/gamingSessions";
import { initialState as usersInitialState } from "../../reducers/users";

const mockStore = configureStore([]);

it("successfully renders", () => {
  const navigation = { state: { params: {} } };
  const initialState = {
    gamingSessions: gamingSessionsInitialState,
    users: usersInitialState
  };
  const rendered = shallow(<GamingSession navigation={navigation} />, {
    context: { store: mockStore(initialState) }
  });
  expect(rendered.dive().dive()).toMatchSnapshot();
});
