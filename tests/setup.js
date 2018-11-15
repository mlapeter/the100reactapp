import Enzyme from "enzyme";

import Adapter from "enzyme-adapter-react-16";

global.fetch = require("jest-fetch-mock");

global.FormData = require("FormData");

Enzyme.configure({ adapter: new Adapter() });
