"use client"
import { z } from "zod"

const responseSchema = z.object({
  content: z.string().min(1, "Response cannot be empty").max(2000, "Response is too long"),
})

// Rest of the file remains the same
