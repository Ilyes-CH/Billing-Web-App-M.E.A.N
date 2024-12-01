/**
* @Access access only to Admin
* @Actions GET | PUT | DELETE | POST
*/


const express = require('express')
const router = express.Router();
const bcrypt = require('bcrypt')
const multer = require('multer')
const { sendEmailWithoutAttachment } = require('../helpers/mailer')
const multerConfig = require('../helpers/imageMulterConfig')
const checkAdmin = require('../middlewares/checkAdmin')
const isValidObjectId = require('../helpers/verifyObjectId')
const authenticateToken = require('../middlewares/authenticateToken')
const [generateAccessToken, generateRefreshToken] = require('../helpers/generateTokens');
require('dotenv').config({ path: '../main/.env' })

//load users model
const User = require('../models/user');
const OTP = require('../models/otpModel')
const Notice = require('../models/notice');
const UserArchive = require('../models/userArchive');
const Gain = require('../models/gains')
const Order = require('../models/order')
const Feedback = require('../models/feedback');
const Invoice = require('../models/invoice')
const PORT = process.env.PORT


/**@Login Route */
router.post("/auth/login", async (req, res) => {
  console.log("\x1b[35m*******************Login Route\x1b[0m");

  try {
    const { email, password } = req.body;
    console.log('request body', req.body);

    const user = await User.findOne({ email });
    console.log('found user', user)
    if (!user) {
      return res.status(403).json({ message: "Email or Password is incorrect" });
    }

    console.log("Password from request:", password);
    console.log("Hashed password from DB:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(403).json({ message: "Email or Password is incorrect" });
    }
    if (!user.status) {
      return res.status(401).json({ message: "Account not Valid by Admin" });

    }
    const userToCache = {
      id: user._id,
      role: user.role,
      status: user.status,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
    };

    const accessToken = generateAccessToken(userToCache);
    const refreshToken = generateRefreshToken({ id: user._id });
    console.log(accessToken, refreshToken);

    // Save the refresh token to the database
    user.refreshToken = refreshToken;
    const updatedUser = await user.save();

    console.log(updatedUser);
    res.status(200).json({ accessToken, refreshToken, message: "Success" });

  } catch (error) {
    console.log(`\x1b[31mError In Login: \x1b[0m ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



/**@SignUp Route */
//verify role and if the role is accountant verify the work id
router.post('/auth/signup', multer({ storage: multerConfig }).single('img'), checkAdmin, async (req, res) => {
  console.log("\x1b[35m*******************Sign Up Route\x1b[0m");
  // console.log(req.body)
  try {
    const userObject = req.body;
    console.log(userObject)
    if (Object.keys(userObject).length === 0) {
      res.status(400).json({ message: 'Empty request body' });
    }
    else {
      const foundUserByEmail = await User.findOne({ email: userObject.email });
      const foundUserByPhone = await User.findOne({ phone: userObject.phone });
      if (foundUserByEmail && foundUserByPhone) {
        res.status(400).json({ message: 'Email and Phone Number already been used' });

      } else if (foundUserByPhone) {
        res.status(400).json({ message: 'Phone already been used' });

      }
      else if (foundUserByEmail) {
        res.status(400).json({ message: 'Email already been used' });

      }
      else {

        //find the most recent OTP for the email
        const response = await OTP.find({ email: userObject.email }).sort({ createdAt: -1 }).limit(1)
        console.log(response)
        if (response.length === 0 || req.body.otp !== response[0].otp) {
          res.status(400).json({
            message: 'The OTP is not valid',
          });
        }
        else {
          console.log(response[0].workId)
          if (response[0].workId && userObject.role == "Accountant") {
            userObject.workId = response[0].workId
          } else if (!userObject.workId && userObject.role == "Accountant") {
            return res.status(400).json({ message: 'Missing Work Id' })
          }
          userObject.password = await bcrypt.hash(userObject.password, 10);

          if (req.file) {
            console.log(req.file)
            userObject.avatar = `${req.protocol}://${req.get}:${PORT}/images/${req.file.filename}`; //req.protocol req.get
          } else {
            userObject.avatar = `${req.protocol}://${req.get}:${PORT}/images/avatar.png`;
          }
          if (userObject.role == "Accountant") {
            userObject.status = false
          }
          console.log(userObject)
          const user = new User(userObject);
          await user.save();
          sendEmailWithoutAttachment(userObject.firstName, userObject.email, "welcome", 'welcome', '')
          //send account confirmation email 
          res.status(201).json({ message: 'New User Created' });
        }
      }
    }
  } catch (error) {
    console.log(`\x1b[31mError During Sign up:\x1b[0m ${error}`)

    res.status(500).json({ message: 'Error Creating New User', error });
  }


});



//Actions on All users

router.get('/', (req, res) => {

  User.find().then((docs) => {

    console.log("\x1b[35m*******************GET Users Route\x1b[0m")
    if (docs.length > 0) {
      console.log(docs)
      res.status(200).json({ data: docs })
    } else {
      res.status(404).json({ message: "users not found" })
    }

  }).catch((e) => {
    console.log(`\x1b[31mError in getting users:\x1b[0m ${e}`)

    res.status(500).json({ message: 'Internal Server Error' })
  })
})

router.get('/archivedUsers', (req, res) => {

  UserArchive.find().then((docs) => {

    console.log("\x1b[35m*******************GET Deleted Users Route\x1b[0m")
    if (docs.length > 0) {
      console.log(docs)
      res.status(200).json({ data: docs })
    } else {
      res.status(404).json({ message: "deleted users not found" })
    }

  }).catch((e) => {
    console.log(`\x1b[31mError in getting deleted users:\x1b[0m ${e}`)

    res.status(500).json({ message: 'Internal Server Error' })
  })
})


router.delete('/', (req, res) => {
  console.log("\x1b[35m*******************Delete Users Route\x1b[0m")

  User.deleteMany().then((response) => {

    response.deletedCount > 0 ? res.status(200).json({ message: 'Users are deleted' }) : res.status(304).json({ message: 'No Users were deleted' })

  }).catch((e) => {
    console.log(`\x1b[31mError in deleting users:\x1b[0m ${e}`)

    res.status(500).json({ message: 'Internal Server Error' })
  })

})

//Actions on Single user

router.get('/:id', (req, res) => {
  console.log("\x1b[35m*******************GET User By Id Route\x1b[0m")
  const id = req.params.id
  if (isValidObjectId(id)) {

    User.findById(id).then((user) => {

      if (user) {
        let userToCache = {
          firstName: user.firstName,
          lastName: user.lastName,
          id: user._id,
          email: user.email,
          phone: user.phone,
          role: user.role,
          image: user.avatar,
          city: user.city,
          country: user.country,
          zip: user.zip,
        };
        res.status(200).json({ message: "Found User", data: userToCache })
      } else {
        res.status(404).json({ message: "User Not Found" })

      }


    }).catch((e) => {
      console.log(`\x1b[31mError in getting the user:\x1b[0m ${e}`)

      res.status(500).json({ message: 'Internal Server Error' })
    })
  } else {
    res.sendStatus(400)
  }

})




router.put('/', (req, res) => {
  console.log("\x1b[35m*******************Update User Route\x1b[0m")
  const id = req.body.id
  console.log(req.body)
  if (isValidObjectId(id)) {
    User.updateOne({ _id: id }, req.body).then((response) => {

      response.nModified == 1 ? res.status(200).json({ message: "Update done" }) : res.status(304).json({ message: 'Update not done' })

    }).catch((e) => {
      console.log(`\x1b[31mError updating the user:\x1b[0m ${e}`)

      res.status(500).json({ message: 'Internal Server Error' })
    })
  } else {
    res.sendStatus(400)
  }



})

//delete user with their notices
router.delete('/:id', (req, res) => {
  console.log("\x1b[35m******************* Delete User By Id Route *******************\x1b[0m");

  const id = req.params.id;
  if (!id) return res.status(400).json({ message: 'No User Id Supplied' });

  if (!isValidObjectId(id)) return res.status(400).json({ message: 'Invalid User Id' });

  Notice.deleteMany({ customerId: id })
    .then((noticeResponse) => {
      const noticeMessage = noticeResponse.deletedCount > 0
        ? `Deleted Notices: ${noticeResponse.deletedCount}`
        : 'No Notices';

      Feedback.deleteMany({ commentorId: id })
        .then((feedbackRes) => {
          const feedbackMesage = feedbackRes.deletedCount > 0
            ? `Deleted Feedbacks: ${feedbackRes.deletedCount}`
            : 'No Feedbacks';

          User.findById(id)
            .then((userDoc) => {
              if (!userDoc) return res.status(404).json({ message: 'User not found' });

              const userToArchive = {
                firstName: userDoc.firstName,
                lastName: userDoc.lastName,
                email: userDoc.email,
                phone: userDoc.phone,
                role: userDoc.role,
                active: false,
                previousId: String(userDoc._id),
                creationDate: userDoc.createdAt,
                avatar: userDoc.avatar,
                age: userDoc.age,
                workId: userDoc.workId,
              };

              new UserArchive(userToArchive).save()
                .then((archivedUser) => {
                  Order.find({ customerId: userDoc._id })
                    .then((orders) => {
                      const orderUpdates = orders.map((order) =>
                        Order.updateOne({ _id: order._id }, { archivedUserId: archivedUser._id })
                      );

                      Promise.all(orderUpdates)
                        .then(() => {
                          Invoice.find({ customerId: userDoc._id }) 
                            .then((invoices) => {
                              const invoiceUpdates = invoices.map((invoice) =>
                                Invoice.updateOne({ _id: invoice._id }, { archivedUserId: archivedUser._id })
                              );

                              return Promise.all(invoiceUpdates);
                            })
                            .then(() => {
                              // Delete the user
                              User.deleteOne({ _id: id })
                                .then((deleteResponse) => {
                                  if (deleteResponse.deletedCount === 1) {
                                    res.status(200).json({
                                      message: `User Deleted | ${noticeMessage} | ${feedbackMesage}`,
                                    });
                                  } else {
                                    res.status(304).json({
                                      message: `User Not Deleted | ${noticeMessage} | ${feedbackMesage}`,
                                    });
                                  }
                                })
                                .catch((err) => {
                                  console.error(`\x1b[31mError deleting user:\x1b[0m ${err}`);
                                  res.status(500).json({ message: 'Error deleting user' });
                                });
                            })
                            .catch((err) => {
                              console.error(`\x1b[31mError updating invoices:\x1b[0m ${err}`);
                              res.status(500).json({ message: 'Error updating invoices' });
                            });
                        })
                        .catch((err) => {
                          console.error(`\x1b[31mError updating orders:\x1b[0m ${err}`);
                          res.status(500).json({ message: 'Error updating orders' });
                        });
                    })
                    .catch((err) => {
                      console.error(`\x1b[31mError finding orders:\x1b[0m ${err}`);
                      res.status(500).json({ message: 'Error finding orders' });
                    });
                })
                .catch((err) => {
                  console.error(`\x1b[31mError archiving user:\x1b[0m ${err}`);
                  res.status(500).json({ message: 'Error archiving user' });
                });
            })
            .catch((err) => {
              console.error(`\x1b[31mError finding user:\x1b[0m ${err}`);
              res.status(500).json({ message: 'Error finding user' });
            });
        })
        .catch((err) => {
          console.error(`\x1b[31mError deleting feedbacks:\x1b[0m ${err}`);
          res.status(500).json({ message: 'Error deleting feedbacks' });
        });
    })
    .catch((err) => {
      console.error(`\x1b[31mError deleting notices:\x1b[0m ${err}`);
      res.status(500).json({ message: 'Error deleting notices' });
    });
});


router.get('/updateStatus/:id', (req, res) => {
  console.log("\x1b[35m*******************Validate User By Id Route\x1b[0m")
  const id = req.params.id
  if (!id) {
    res.sendStatus(400)
  } else {

    if (isValidObjectId(id)) {
      User.findById({ _id: id }).then((doc) => {
        if (doc) {
          doc.status = !doc.status
          User.updateOne({ _id: doc._id }, doc).then((response) => {
            response.nModified == 1 ? res.status(200).json({ message: 'User Status Is Updated' }) : res.status(304).json({ message: 'User Status not udpated' })

          })
        } else {
          res.status(404).json({ message: 'User Not Found' })

        }

      }).catch((e) => {
        console.log(`\x1b[31mError in user validation:\x1b[0m ${e}`)
        res.status(500).json({ message: 'Internal Server Error' })
      })

    } else {
      res.sendStatus(400)
    }

  }

})

module.exports = router
