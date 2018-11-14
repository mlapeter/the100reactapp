import React from "react";
import { shallow } from "enzyme";
import configureStore from "redux-mock-store";

import Groups from "../Groups";
import { initialState as authenticationInitialState } from "../../reducers/authentication";
import { initialState as usersInitialState } from "../../reducers/users";

const mockStore = configureStore([]);

it("successfully renders", () => {
  const navigation = { state: { params: {} } };
  const initialState = {
    authentication: authenticationInitialState,
    users: usersInitialState
  };
  const rendered = shallow(<Groups navigation={navigation} />, {
    context: { store: mockStore(initialState) }
  });
  expect(rendered.dive().dive()).toMatchSnapshot();
});
