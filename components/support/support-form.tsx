"use client"
import { z } from "zod"

const supportFormSchema = z.object({
  name: z.string().min(2, "Name is too short").max(100, "Name is too long"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject is too short").max(100, "Subject is too long"),
  message: z.string().min(10, "Message is too short").max(2000, "Message is too long"),
})

// Rest of the file remains the same
