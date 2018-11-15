import React from "react";
import { shallow } from "enzyme";
import configureStore from "redux-mock-store";

import Group from "../Group";
// import { initialState as authenticationInitialState } from "../../reducers/authentication";
import { initialState as usersInitialState } from "../../reducers/users";
import { initialState as groupInitialState } from "../../reducers/group";

const mockStore = configureStore([]);

it("successfully renders", () => {
  const navigation = { state: { params: {} } };
  const initialState = {
    // authentication: authenticationInitialState,
    users: usersInitialState,
    group: groupInitialState
  };
  const rendered = shallow(<Group navigation={navigation} />, {
    context: { store: mockStore(initialState) }
  });
  expect(rendered.dive().dive()).toMatchSnapshot();
});
