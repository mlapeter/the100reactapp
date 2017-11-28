import ActionCable from "react-native-actioncable";
import EventEmitter2 from "eventemitter2";

export default class The100Chat extends EventEmitter2 {
  constructor(userToken, chatId) {
    super();

    this.chatId = chatId;

    let cable = ActionCable.createConsumer(
      `wss://pwn-staging.herokuapp.com/cable?token=${userToken}`
    );
    this.chat = cable.subscriptions.create(
      { channel: "ChatChannel", chat_id: chatId },
      {
        connected: this.connected,
        disconnected: this.disconnected,
        received: this.received
      }
    );
  }

  unsubscribe() {
    this.chat.unsubscribe();
    this.chat.removeAllListeners();
  }

  connected = () => {
    console.warn("[CHAT CHANNEL] Connected:", this.chatId);
  };

  disconnected = () => {
    console.warn("[CHAT CHANNEL] Disconnected:", this.chatId);
  };

  received = data => {
    console.warn("[CHAT CHANNEL] Received:", this.chatId, "-", data);
    if (data.command === "new_message") {
      this.emit("new_message", data.message);
    } else if (data.command === "edit_message") {
      this.emit("edit_message", data.message);
    } else if (data.command === "delete_message") {
      this.emit("delete_message", data.message);
    } else {
      console.warn("Unknown Command:", data.command, data);
    }
  };

  createMessage(text) {
    this.chat.perform("create_message", { text: text });
  }

  editMessage(id, text) {
    this.chat.perform("edit_message", { id: id, text: text });
  }

  deleteMessage(id) {
    this.chat.perform("delete_message", { id: id });
  }
}
