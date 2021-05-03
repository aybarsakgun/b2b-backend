import { ClassConstructor, plainToClass } from "class-transformer";
import { validate } from "class-validator";

export const transformAndValidate = async <T, V>(
  cls: ClassConstructor<T>,
  plain: V
): Promise<T> => {
  const transformedObject = plainToClass(cls, plain, {
    enableImplicitConversion: true,
    excludeExtraneousValues: true,
  });

  await validate(transformedObject as Object, {
    whitelist: true,
    forbidNonWhitelisted: true,
  });

  return transformedObject;
};
