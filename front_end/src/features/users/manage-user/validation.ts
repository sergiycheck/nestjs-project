import Joi from "joi";

const UserRootDataSchema = {
  username: Joi.string().required().min(4),
  firstName: Joi.string().required().min(4),
  lastName: Joi.string().required(),
};

export const userAddSchema = Joi.object({
  ...UserRootDataSchema,
  password: Joi.string().required().min(6),
});

export const userUpdateSchema = Joi.object({
  id: Joi.string().required(),
  ...UserRootDataSchema,
});
