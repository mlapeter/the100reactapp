import React from "react";
import { View } from "react-native";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";

import GroupsList from "../GroupsList";

const groups = [
  {
    header_background_image_api: "img/default-group-header.jpg",
    id: 1578,
    name: "The100 Lounge",
    nickname: "",
    users_count: 77
  }
];

it("renders successfully without children", () => {
  const rendered = renderer.create(<GroupsList groups={[]} />).toJSON();
  console.log(rendered);
  expect(rendered).toBeTruthy();
});

it("renders successfully with one group", () => {
  const rendered = renderer.create(<GroupsList groups={groups} />).toJSON();
  console.log(rendered);
  expect(rendered).toBeTruthy();
});

it("renders with one group", () => {
  const rendered = shallow(<GroupsList groups={groups} />);
  expect(rendered.dive()).toMatchSnapshot();
});
