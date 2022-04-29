import Joi from 'joi';

const userUserName = {
  username: Joi.string().required().min(4),
};

const userPassword = {
  password: Joi.string().required().min(6).max(100),
};

export const userLoginSchema = Joi.object({
  ...userUserName,
  ...userPassword,
});

const UserRootDataSchema = {
  ...userUserName,
  firstName: Joi.string().required().min(4),
  lastName: Joi.string().required(),
};

export const userAddSchema = Joi.object({
  ...UserRootDataSchema,
  ...userPassword,
  repeat_password: Joi.ref('password'),
});

export const userUpdateSchema = Joi.object({
  id: Joi.string().required(),
  ...UserRootDataSchema,
});
