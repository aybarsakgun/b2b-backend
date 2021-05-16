import {IsNumber, IsOptional, IsString} from "class-validator";

export class SettingDto {
  @IsString()
  readonly key: string;

  @IsString()
  @IsOptional()
  readonly value?: string;
}
