import * as Joi from 'joi';

export const validateWallet = Joi.object({
  name: Joi.string().required(),
  total: Joi.number().required(),
  userId: Joi.string().required(),
});

export const validateParams = Joi.object({
  id: Joi.string().required(),
});
