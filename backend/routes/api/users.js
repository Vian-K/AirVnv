const express = require('express')
const router = express.Router();
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


  const validateSignup = [
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Please provide a valid email.'),
    check('username')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),
    check('password')
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
  ];
  router.post(
    '/',
    validateSignup,
    async (req, res) => {
      const { firstName, lastName, email, password, username } = req.body;
      const user = await User.signup({ firstName, lastName, email, username, password });

      await setTokenCookie(res, user);

      return res.json({
        user: user
      });
    }
  );

// HSjmL1xt-jVtUUq8CJZE7XJ12r4tkpA84YeA
module.exports = router;


// fetch('/api/users', {
//     method: 'POST',
//     headers: {
//       "Content-Type": "application/json",
//       "XSRF-TOKEN": `9TrXH82P-VQRHRfHcDniHyG0zw1jqaDrBmBQ`
//     },
//     body: JSON.stringify({
//         firstName: 'vian',
//         lastName: 'Khach',
//       email: 'tester123@google.com',
//       username: 'viankhach',
//       password: 'asdasds'
//     })
//   }).then(res => res.json()).then(data => console.log(data));
