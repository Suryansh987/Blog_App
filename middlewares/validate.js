import { body , validationResult } from 'express-validator'
const invalidNames = ['null','undefined']
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const validateRegisterData = [
    body('name')
    .escape()
    .exists().withMessage("Name is Required")
    .isLength({min:2}).withMessage("Name should contain at least 2 letters")
    .custom(value=>{
        const lowValue = value.toLowerCase()
        if(invalidNames.includes(lowValue)){
            throw new Error("Invalid Name")
        }
        return true;
    }),
    body('email')
    .exists().withMessage("Email is Required")
    .isEmail().withMessage("Invalid Email"),
    body('password')
    .exists().withMessage("Password is Required")
    .isLength({min:8}).withMessage("Password should contain 8 letters")
    .matches(passwordRegex).withMessage("Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one digit, and one special character"),
    (req,res,next) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({"error":errors.array() })
        }
        next()
    }
]

const validateLoginData = [
    body('email')
    .escape()
    .exists().withMessage("Email is Required")
    .isEmail().withMessage("Invalid Email"),
    body('password')
    .exists().withMessage("Password is Required")
    .isLength({min:8}).withMessage("Password should contain at least 8 Characters")
    .matches(passwordRegex).withMessage("Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one digit, and one special character"),
    (req,res,next)=>{
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(409).json({"error":errors.array()})
        }
        next()
    }
]

const validateBlogData = [
    body('title')
    .escape()
    .exists().withMessage("Title is Required"),
    body('description')
    .exists().withMessage("Description is Required"),
    (req,res,next)=>{
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(409).json({"error":errors.array()})
        }
        if(!req.files?.thumbnail){
            return res.status(409).json({"error":"Thumbnail is Required"})
        }
        next()
    }
]


export {validateRegisterData, validateLoginData, validateBlogData}