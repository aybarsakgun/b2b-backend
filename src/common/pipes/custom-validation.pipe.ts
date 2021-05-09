import {
  ArgumentMetadata,
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
  ValidationError,
} from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";

@Injectable()
export class CustomValidationPipe implements PipeTransform<any> {
  async transform(value, metadata: ArgumentMetadata) {
    if (!value) {
      throw new BadRequestException("No data submitted");
    }
    const { metatype } = metadata;
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value, {
      enableImplicitConversion: true,
    });
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new HttpException(this.buildError(errors), HttpStatus.BAD_REQUEST);
    }
    return object;
  }

  private buildError(errors: ValidationError[]) {
    return errors
      .map((error) =>
        Object.entries(error.constraints).map((item) => ({
          property: error.property,
          error: item[0],
          message: item[1],
        }))
      )
      .reduce((acc, item) => [...acc, ...item], []);
  }

  private toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.find((type) => metatype === type);
  }
}
