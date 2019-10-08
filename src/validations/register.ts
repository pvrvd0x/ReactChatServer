import { check } from "express-validator";

const registerValidation = [
    check('email').isEmail(),
    check('password').isLength({ min: 5 }),
    check('fullname').isLength({ min: 1 })
];

export default registerValidation;