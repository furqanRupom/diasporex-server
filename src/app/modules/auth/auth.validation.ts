import { z } from 'zod';

// Enum validation
const RoleEnum = z.enum(['USER', 'AGENT']);
const StatusEnum = z.enum(['ACTIVE', 'BLOCKED']);

// User schema validation

const userRegisterSchemaValidation = z.object({
 body:z.object({
     name: z.string().min(1, 'Name is required'),
     email: z.string().email('Invalid email address'),
     password: z.string().min(6, 'Password must be at least 6 characters long')
 }),
});

const userLoginValidation = z.object({
  body:z.object({
      email: z.string().email('Invalid email address'),
      password: z.string().min(6, 'Password must be at least 6 characters long')
  })
});


export const authValidations = {
    userRegisterSchemaValidation,
    userLoginValidation
}
