const express = require('express')
const { getSingleUser, getUserFriends, updateAddOrRemoveFriend, searchUser } = require('../controllers/usercontroller')
const router = express.Router()
const Authorization = require('../middleware/Authorization')
    //middleware
    // router.use(Authorization)
    //routes
router.get('/user/:id', getSingleUser)
router.get('/user/friends/:id', getUserFriends)
router.patch('/user/updatefriend/:id/:friendid', updateAddOrRemoveFriend)
router.get('/user/search/:searchuser', searchUser)
module.exports = router