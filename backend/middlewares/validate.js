import { body , validationResult } from 'express-validator'
const invalidNames = ['null','undefined']
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const validateRegisterData = [
    body('name')
    .escape()
    .exists()
    .isLength({min:2}).withMessage("Name should contain at least 2 letters")
    .custom(value=>{
        const lowValue = value.toLowerCase()
        if(invalidNames.includes(lowValue)){
            throw new Error("Invalid Name") 
        }
        return true;
    }),
    body('email')
    .exists()
    .isEmail().withMessage("Invalid Email"),
    body('password')
    .exists()
    .isLength({min:8})
    .matches(passwordRegex).withMessage(    ),
    (req,res,next) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            const regErrors=errors.array()
            const error = regErrors.reduce((error,value)=>{
                error[value.path] = value.msg
                return error
            },{})
            return res.status(400).json({error})
        }
        next()
    }
]

const validateLoginData = [
    body('email')
    .escape()
    .exists()
    .isEmail().withMessage("Invalid Email"),
    body('password')
    .exists()
    .isLength({min:8})
    .matches(passwordRegex).withMessage("Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one digit, and one special character"),
    (req,res,next)=>{
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            const loginErrors=errors.array()
            const error = loginErrors.reduce((error,value)=>{
                error[value.path] = value.msg
                return error
            },{})
            return res.status(400).json({error})
        }
        next()
    }
]

const validateBlogData = [
    body('title')
    .exists().withMessage("Title is Required"),
    body('description')
    .exists().withMessage("Description is Required"),
    (req,res,next)=>{
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            const blogErrors=errors.array()
            const error = blogErrors.reduce((error,value)=>{
                error[value.path] = value.msg
                return error
            },{})
            return res.status(400).json({error})
        }
        if(!req.files?.thumbnail){
            return res.status(409).json({"error":"Thumbnail is Required"})
        }
        next()
    }
]


export {validateRegisterData, validateLoginData, validateBlogData}