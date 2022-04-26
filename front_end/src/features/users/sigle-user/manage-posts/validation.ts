import Joi from "joi";
import { PostGenre } from "../../../posts/types";

export const createPostDataToValidate = {
  title: Joi.string().required().min(5).max(400),
  subtitle: Joi.string().required().min(5).max(50),
  description: Joi.string().required().min(5).max(5000),
  category: Joi.string()
    .required()
    .valid(...[PostGenre.Games, PostGenre.Sport, PostGenre.History]),
  ownerId: Joi.string().required(),
};

export type CreatePostDataToValidateKeysType = keyof typeof createPostDataToValidate;

export const createPostSchema = Joi.object({
  ...createPostDataToValidate,
});

const postId = {
  id: Joi.string().required(),
};

export const editPostDataToValidate = {
  ...createPostDataToValidate,
  ...postId,
};
export type EditPostDataToValidateKeysType = keyof typeof editPostDataToValidate;

export const updatePostSchema = Joi.object({
  ...editPostDataToValidate,
});
