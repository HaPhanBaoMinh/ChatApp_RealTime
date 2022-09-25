const UserModel = require("../models/userModel");

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const usernameCheck = await UserModel.findOne({ username });
    if (usernameCheck)
      return res.json({ msg: "Username already used", status: false });

    const emailCheck = await UserModel.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });

    const user = await UserModel.create({
      username,
      email,
      password,
    });

    return res.json({ status: true, user });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username, password });
    if (!user)
      return res.json({ msg: "Incorrect username or password", status: false });

    return res.json({ status: true, user });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const _id = req.params._id;
    const { image } = req.body;
    const user = await UserModel.findOneAndUpdate(
      { _id },
      { avatarImage: image, isAvatarImageSet: true },
      { new: true }
    );
    return res.json({ status: true, user });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await UserModel.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);
    res.send(users);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
