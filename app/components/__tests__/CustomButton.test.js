import React from "react";
import Touchable from "react-native-platform-touchable";
import { shallow } from "enzyme";
import CustomButton from "../CustomButton";

it("handles a press", () => {
  const callback = jest.fn();
  const wrapper = shallow(<CustomButton title="test 1" onPress={callback} />);

  expect(wrapper.find(Touchable).length).toBe(1);

  wrapper
    .find(Touchable)
    .first()
    .props()
    .onPress();

  expect(callback).toHaveBeenCalled();
});
