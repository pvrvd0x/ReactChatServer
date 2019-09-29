import { check } from "express-validator";

const loginValidation = [
    check('email').isEmail(),
    check('password').isLength({ min: 5 })
];

export default loginValidation;