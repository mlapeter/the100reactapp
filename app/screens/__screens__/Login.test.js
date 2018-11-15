import React from "react";
import { shallow } from "enzyme";
import configureStore from "redux-mock-store";

import Login from "../Login";
import { initialState as authenticationInitialState } from "../../reducers/authentication";

const mockStore = configureStore([]);

it("successfully renders", () => {
  // const navigation = { state: { params: {} } };
  const initialState = { authentication: authenticationInitialState };
  const rendered = shallow(<Login />, {
    context: { store: mockStore(initialState) }
  });
  expect(rendered.dive().dive()).toMatchSnapshot();
});
