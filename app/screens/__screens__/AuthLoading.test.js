import React from "react";
import { shallow } from "enzyme";
import configureStore from "redux-mock-store";

import AuthLoading from "../AuthLoading";
import { initialState } from "../../reducers/authentication";

const mockStore = configureStore([]);

it("successfully renders", () => {
  // const navigation = { state: { params: {} } };
  const initialState = { authentication: initialState };
  const rendered = shallow(<AuthLoading />, {
    context: { store: mockStore(initialState) }
  });
  expect(rendered.dive()).toMatchSnapshot();
});
