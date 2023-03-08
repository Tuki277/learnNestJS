import * as Joi from 'joi';

export const dataSync = Joi.object({
  fullname: Joi.string().required(),
  userId: Joi.string().required(),
});

export const dataSyncPostgreSQL = Joi.object({
  username: Joi.string().required(),
  userId: Joi.string().required(),
  isActive: Joi.boolean().required(),
});
