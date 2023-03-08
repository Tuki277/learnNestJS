import * as Joi from 'joi';

export const registerSchema = Joi.object({
  // username: Joi.string().regex(new RegExp(pattern)).required(),
  username: Joi.string().required(),
  // password: Joi.string().regex(new RegExp(patternAtoZ)).required(),
  fullname: Joi.string().required(),
  password: Joi.string().required(),
  age: Joi.number().required(),
  role: Joi.number(),
});

export const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});
