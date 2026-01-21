
import * as z from "zod"

export const baseFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  director: z.string().min(2, "Director name must be at least 2 characters"),
  price: z.string().regex(/^\d*\.?\d*$/, "Must be a valid number"),
  tokenId: z.string().regex(/^\d+$/, "Must be a valid token ID"),
})

export const urlFormSchema = baseFormSchema.extend({
  filmUrl: z.string().url("Must be a valid URL"),
})

export const fileFormSchema = baseFormSchema.extend({
  file: z.instanceof(File, { message: "Please select a file" }),
})

export type UrlFormValues = z.infer<typeof urlFormSchema>
export type FileFormValues = z.infer<typeof fileFormSchema>
