const bcrypt = require('bcrypt');
const User = require('../models/user');

module.exports = {
  // login: async (data) => {
  //   try {
  //     const user = await User.findOne({ email: data.email });
  //     const passwordCheck = await bcrypt.compare(data.password, user.password);

  //     if (!user) {
  //       return {
  //         checked: false,
  //         msg: 'Wrong email !',
  //       };
  //     }
  //     if (!passwordCheck) {
  //       return {
  //         checked: false,
  //         msg: 'Wrong password !',
  //       };
  //     }
  //     if (user && passwordCheck) {
  //       return {
  //         checked: true,
  //         msg: 'Valid email and password !',
  //       };
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },
};
