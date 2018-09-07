// @flow
import type {IconName} from "./Icon";

export type Picture = {
    uri: string,
    preview: string
};

export type Location = {
    latitude: number,
    longitude: number
};

export type Marker = {
    id: string,
    coordinate: Location
};

export type Action = {
    icon: IconName,
    onPress: () => mixed
};
