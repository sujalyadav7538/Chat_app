import mongoose from 'mongoose';
import User from './UserModal.js';

const { Schema } = mongoose;

const MessageSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  recipient: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: function () {
      return this.messageType === 'text'; // Make recipient required only for text messages
    },
  },
  messageType: {
    type: String,
    enum: ["text", "file"],
    required: true,
  },
  content: {
    type: String,
    required: function () {
      return this.messageType === 'text';
    },
  },
  fileUrl: {
    type: String,
    required: function () {
      return this.messageType === 'file';
    },
  },
  timeStamp: {
    type: Date,
    default: Date.now,
  },
});

// Indexing for performance on commonly queried fields
MessageSchema.index({ sender: 1, recipient: 1, timeStamp: -1 });

const Message = mongoose.model("Messages", MessageSchema);

export default Message;
