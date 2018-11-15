import { fetchToken } from "../authentication";

describe("fetchToken", () => {
  it("creates a properly formatted action", () => {
    const expected = {
      type: "FETCH_TOKEN",
      username: "user1",
      password: "12345"
    };
    const actual = fetchToken("user1", "12345");
    expect(actual).toEqual(expected);
  });

  it("creates a properly formatted action", () => {
    expect(fetchToken("user1", "12345")).toMatchSnapshot();
  });
});
