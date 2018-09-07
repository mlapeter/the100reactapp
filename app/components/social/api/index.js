// @flow
import * as _ from "lodash";
import type {Picture} from "../../components/Model";

const users = require("./users");
const posts = require("./posts");
const myPosts = require("./my-posts");
const stories = require("./stories");
const messages = require("./messages");

export type User = {
    id: string,
    name: string,
    picture: string,
    caption: string,
    cover: Picture
};

export type Post = {
    id: string,
    user: string,
    picture?: Picture,
    caption: string,
    timestamp: number,
    comments: string[]
};

export type MessageThread = {
    id: string,
    user: string,
    messages: Message[]
};

export type Message = {
    id: string,
    me: boolean,
    message: string,
    timestamp: number
};

export type Comment = {
    user: string,
    comment: string,
    timestamp: number
};

export type Story = {
    id: string,
    user: string,
    picture: Picture,
    comments: Comment[],
    read: boolean
};

export type Social = {
    messages: MessageThread[],
    users: User[],
    posts: Post[],
    stories: Story[],
    user: string => User,
    story: string => Story,
    messageThread: string => MessageThread,
    me: () => User,
    myPosts: Post[]
};

const api: Social = {
    messages,
    users,
    posts,
    stories: _.sortBy(stories, story => story.read),
    user: (id: string): User => users.filter(user => user.id === id)[0],
    story: (id: string): Story => stories.filter(story => story.id === id)[0],
    messageThread: (id: string): MessageThread => messages.filter(thread => thread.id === id)[0],
    me: (): User => users.filter(user => user.id === "schavez")[0],
    myPosts
};

export default api;
