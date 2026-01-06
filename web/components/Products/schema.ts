import * as z from "zod"

export const FormSchema = z.object({
    name: z.string().min(5, { error: "Minimum 5 characters" }),
    description: z.string().min(5, { error: "Minimum 5 characters" }),
    category: z.string(),
    stock: z.preprocess(e => e === '' ? undefined : e,
        z.coerce.number({ error: "Must be an integer" }).int({ error: "Must be an integer" }).min(0, { error: "Cannot be negative" })
    ),
    minimumStock: z.preprocess(e => e === '' ? undefined : e,
        z.coerce.number({ error: "Must be an integer" }).int({ error: "Must be an integer" }).min(0, { error: "Cannot be negative" })
    ),
    price: z.preprocess(e => e === '' ? undefined : e,
        z.coerce.number({ error: "Must be a number" }).min(0, { error: "Cannot be negative" })
    ),
    status: z.enum(["Draft", "Published"])
})

export type FormFields = z.infer<typeof FormSchema>