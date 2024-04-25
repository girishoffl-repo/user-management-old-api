const express = require('express')

const router = express.Router()

const {authenticateUser} = require('../middleware/authentication')
const {createUser,loginUser,updateUser,pagination,softDelete,changePassword} = require('../controller/userController')

router.route('/createuser').post(createUser)
router.route('/login').post(loginUser)
router.route('/updateuser/:id').patch(authenticateUser,updateUser)
router.route('/page').get(authenticateUser,pagination)
router.route('/deleteuser').delete(authenticateUser,softDelete)
router.route('/changepassword').post(authenticateUser,changePassword)


module.exports = router