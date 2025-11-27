const authController = require("../controllers/auth.controller");
const express = require("express");
const router = express.Router();

const {validateWithJoi} = require("../middlewares/validation.middlewares");
const { signUpSchema, signInSchema } = require("../dtos/auth.dto");

router.post('/sign-up', validateWithJoi(signUpSchema), authController.SignUp);
router.post('/sign-in', validateWithJoi(signInSchema), authController.SignIn);

module.exports = router;