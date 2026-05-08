import { z } from 'zod'
import { zodValidate } from '../zod'

const contactValidationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Enter a valid email address'),
  phone: z.object({
    countryCode: z.string(),
    number: z.string(),
  }).optional(),
  interests: z.array(z.enum(['grapheneos', 'umbrelos', 'business', 'other'])).min(1, 'Select at least one interest'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

export const validateContactForm = zodValidate(contactValidationSchema)
