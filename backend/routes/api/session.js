const express = require('express')
const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { INTEGER, DATE } = require('sequelize');



// router.post('/', async (req, res, next) => {
//       const { credential, password } = req.body;

//       const user = await User.login({ credential, password });

//       if (!user) {
//         const err = new Error('Login failed');
//         err.status = 401;
//         err.title = 'Login failed';
//         err.errors = ['The provided credentials were invalid.'];
//         return next(err);
//       }

//       await setTokenCookie(res, user);

//       return res.json({
//         user: user
//       });
//     }
//   );


router.delete('/', (_req, res) => {
      res.clearCookie('token');
      return res.json({ message: 'success' });
    })

router.get('/', restoreUser, (req, res) => {
        const { user } = req;
        if (user) {
          return res.json({
            user: user.toSafeObject()
          });
        } else return res.json({ user: null });
      }
    );


    const validateLogin = [
      check('credential')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Please provide a valid email or username.'),
      check('password')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a password.'),
      handleValidationErrors
    ];

    router.post('/', validateLogin, async (req, res, next) => {
        const { credential, password } = req.body;

        const user = await User.login({ credential, password });

        if(!req.body) {
          const err= new Error('Validation error')
          err.status = 400;
          err.title = 'Validation error'
          err.errors = [ {
            "credential" : 'Email or username is required',
            "password" : 'Password is required'
          }
          ]
          return next(err)
        }
        if (!user) {
          const err = new Error('Login failed');
          err.status = 401;
          err.title = 'Login failed';
          err.errors = ['The provided credentials were invalid.'];
          return next(err);
        }
        await setTokenCookie(res, user);

        return res.json({
          user: user
        });
      }
    );



module.exports = router;

// L2CADJyC-5v4L3GXA72olBA3QCkKtvkg9cmA

// npx sequelize-cli model:generate --name SpotImage --attributes spotId:INTEGER,url:STRING,preview:BOOLEAN,createdAt:DATE,updatedAt:DATE
