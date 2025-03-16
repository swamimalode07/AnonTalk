import {z} from "zod"
export const usernameValidation=
    z.string()
    .min(2,"Username must be atleast two characters")
    .min(10,"Username must be less than ten characters")
    .regex(/^[a-zA-Z0-9_]+$/ ,"Username must not contain special Characters")

export const SignupSchema=z.object({
    username:usernameValidation,
    email:z.string().email({message:"Invalid email address"}),
    password:z.string().min(6,{ message:"Length of Password should be atleast 6 characters"})

})
