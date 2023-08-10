const router = require('express').Router();
const {
  getUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  removeFriend,
} = require('../../controllers/userController');

// /api/User
router.route('/')
  .get(getUsers)
  .post(createUser);

// /api/User/:userId
router.route('/:userId')
  .get(getSingleUser)
  .put(updateUser)
  .delete(deleteUser);

// /api/User/:userId/friends/:friendId
router.route('/:userId/friends/:friendId')
  .post(addFriend)
  .delete(removeFriend);
//localhost:3001/api/User/id of user getting a friend/friends/id of user becoming a friend
module.exports = router;
