import Joi from "joi";

export const schemaTokenValidation = Joi.string()
  .regex(/^[\w\-_]+\.[\w\-_]+\.[\w\-_.+/=]*$/)
  .required();
