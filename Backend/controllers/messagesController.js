const MessagesModel = require("../models/messageModel");

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const data = await MessagesModel.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data) {
      return res.json({ msg: "Message addedd successfully" });
    }
    return res.json({ msg: "Failed to addedd message to database" });
  } catch (error) {
    next(error);
  }
};
module.exports.getAllMessage = async (req, res, next) => {
  try {
    const { from, to } = req.body;
    const message = await MessagesModel.find({
      users: { $all: [from, to] },
    }).sort({ updateAt: 1 });
    const projectMessages = message.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    res.json(projectMessages);
  } catch (error) {
    next(error);
  }
};
