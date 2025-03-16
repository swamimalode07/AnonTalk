import {z} from "zod"

export const MessageSchema=z.object({
    content:z.string()
    .min(10,"Content should not be less than 10 characters" )
    .max(300,"Content should not be longer than 300 characters")
})