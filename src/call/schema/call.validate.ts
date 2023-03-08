import * as Joi from 'joi';

export const createCall = Joi.object({
  username: Joi.string().required(),
  userId: Joi.string().required(),
  isCall: Joi.boolean().required(),
});

export const updateCall = Joi.object({
  id: Joi.string().required(),
  isCall: Joi.boolean().required(),
});

export const idParams = Joi.object({
  id: Joi.string().required(),
});
