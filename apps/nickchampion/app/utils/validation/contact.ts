import { z } from 'zod'
import { zodValidate } from './zod'

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Enter a valid email address'),
  phone: z.object({
    countryCode: z.string(),
    number: z.string(),
  }).optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

export const validateContactForm = zodValidate(contactSchema)
