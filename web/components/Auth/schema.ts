import * as z from 'zod'


const AuthFormSchema = z.object({
    email: z
        // Use the built-in RFC 5322 compliant regex for 2026 standards
        .email({ message: "Please enter a valid email address" })
        // Optional: Add manual domain restriction if needed
        .toLowerCase()
        .trim(),
    password: z.string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(20, { message: "Password cannot exceed 20 characters" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
        .regex(/[0-9]/, { message: "Password must contain at least one number" })
        .regex(/[^A-Za-z0-9\s]/, { message: "Password must contain at least one special character" }).trim(),
    fullName: z.string()
        .min(5, "Name must be at least 5 characters")
        .max(70, "Name is too long")
        // Unicode-aware regex: Matches letters from any language (\p{L}) 
        // and allows spaces, hyphens, and apostrophes.
        .regex(
            /^\p{L}+([\s'-]\p{L}+)*$/u,
            "Name can only contain letters and standard separators (space, hyphen, apostrophe)"
        )
        .trim(),

})

export default AuthFormSchema