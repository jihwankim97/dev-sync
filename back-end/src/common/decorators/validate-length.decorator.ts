import { registerDecorator, ValidationOptions } from 'class-validator';
import {
  USER_VALIDATION,
  POST_VALIDATION,
  COMMENT_VALIDATION,
} from '../const/validation.const';
import { BadRequestException } from '@nestjs/common';

export function ValidateLength(
  fieldType:
    | 'USER_NAME'
    | 'USER_EMAIL'
    | 'POST_TITLE'
    | 'POST_CONTENT'
    | 'COMMENT_CONTENT',
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'validateLength',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;

          const validation = getValidationConfig(fieldType);
          const minLength =
            'MIN_LENGTH' in validation ? validation.MIN_LENGTH : 0;

          return (
            value.length >= minLength && value.length <= validation.MAX_LENGTH
          );
        },
        defaultMessage() {
          const validation = getValidationConfig(fieldType);
          return validation.MESSAGE;
        },
      },
    });
  };
}

function getValidationConfig(fieldType: string) {
  switch (fieldType) {
    case 'USER_NAME':
      return USER_VALIDATION.NAME;
    case 'USER_EMAIL':
      return USER_VALIDATION.EMAIL;
    case 'POST_TITLE':
      return POST_VALIDATION.TITLE;
    case 'POST_CONTENT':
      return POST_VALIDATION.CONTENT;
    case 'COMMENT_CONTENT':
      return COMMENT_VALIDATION.CONTENT;
    default:
      throw new BadRequestException(`알 수 없는 필드 타입: ${fieldType}`);
  }
}
