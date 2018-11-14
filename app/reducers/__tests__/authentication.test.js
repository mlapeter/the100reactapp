import reducer from "../authentication";
import { fetchToken } from "../../actions/authentication";

const initialState = {
  appLoading: true,
  isLoading: false,
  isAuthed: false,
  user: {},
  token: "",
  firebaseToken: ""
};

it("sets initial state", () => {
  const expected = { ...initialState };
  const actual = reducer(undefined, {});
  expect(actual).toEqual(expected);
});

it("sets initial state using snapshot", () => {
  expect(reducer(undefined, {})).toMatchSnapshot();
});

it("fetches token with valid username and password", () => {
  const expected = {
    ...initialState,
    username: "user1",
    password: "pw123",
    isLoading: true
  };
  const actual = reducer(undefined, fetchToken("user1", "pw123"));
  expect(actual).toEqual(expected);
});

it("fetches token with valid username and password using snapshot", () => {
  expect(reducer(undefined, fetchToken("user1", "pw123"))).toMatchSnapshot();
});
