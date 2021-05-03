import { applyDecorators, SetMetadata } from "@nestjs/common";

export function Public(): Function {
  return applyDecorators(SetMetadata("public", true));
}
