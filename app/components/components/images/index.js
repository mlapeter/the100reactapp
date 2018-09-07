// @flow
import {Asset} from "expo";

const logo = require("../../../app.png");

export default class Images {

    static logo = logo;

    static downloadAsync(): Promise<*>[] {
        return [
            Asset.loadAsync(Images.logo)
        ];
    }
}
