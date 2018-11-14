import React from "react";
import { View } from "react-native";
import renderer from "react-test-renderer";

import { Container, styles } from "../Container";

it("exports a styles object", () => {
  expect(typeof styles).toBe("object");
});

it("renders successfully without children", () => {
  const rendered = renderer.create(<Container />).toJSON();
  console.log(rendered);
  expect(rendered).toBeTruthy();
});

it("renders children props", () => {
  const rendered = renderer
    .create(
      <Container>
        <View />
      </Container>
    )
    .toJSON();
  expect(rendered).toMatchSnapshot();
});
