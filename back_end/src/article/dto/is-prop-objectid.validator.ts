import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import mongoose from 'mongoose';

@ValidatorConstraint({ name: 'isObjectId', async: false })
export class IsPropObjectId implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    return mongoose.Types.ObjectId.isValid(text);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Text ($value) is not an ObjectId!';
  }
}
