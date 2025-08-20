const mongoose = require("mongoose");

const connectRequestSchema = new mongoose.Schema(
  {
    senderUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    receiverUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
      // enum: ['pending', 'accepted', 'rejected'],
      // enum: ['ignore','interested', 'accepted', 'rejected'],
      // default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Creating an index on senderUserId for faster lookups
//connectionRequest.find({senderUserId: 68a1b570ccbee81bae382add, receiverUserId: 68a1b570ccbee81bae382add})
//compound index on senderUserId and receiverUserId to ensure uniqueness
connectRequestSchema.index({ senderUserId:1, receiverUserId:1 }, { unique: true });

connectRequestSchema.pre("save", function (next) {
  const connectionRequest = this
if(connectionRequest.senderUserId.equals(connectionRequest.receiverUserId)) {
    throw new Error("Sender and receiver cannot be the same user");
  }
  next();
})

const ConnectionRequestModel = new mongoose.model("ConnectionRequest", connectRequestSchema)

module.exports = ConnectionRequestModel