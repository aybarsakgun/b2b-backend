import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { Transform, Type } from "class-transformer";
import { UserRole } from "../../users/user.model";

export enum Roles {
  ROLE_USER = "ROLE_USER",
  ROLE_ADMIN = "ROLE_ADMIN",
}

const transformRole = (role: Roles): UserRole => {
  switch (role) {
    case Roles.ROLE_USER:
      return UserRole.USER;
    case Roles.ROLE_ADMIN:
      return UserRole.ADMIN;
    default:
      return null;
  }
};

export class SalesRepresentativeDto {
  @IsNumber()
  readonly id: number;

  @IsString()
  @IsOptional()
  readonly name?: string;

  @IsString()
  @IsOptional()
  readonly phone?: string;

  @IsOptional()
  readonly email?: string;
}

export class UserBranchDto {
  @IsNumber()
  readonly id: number;

  @IsString()
  readonly name: string;
}

export class UserDto {
  @IsString()
  readonly username: string;

  @IsString()
  readonly password: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  readonly currency: string;

  @IsString()
  readonly name: string;

  @IsNumber()
  readonly customerId: number;

  @IsString()
  @IsEnum(UserRole)
  @Transform((param) => transformRole(param.value))
  readonly roles: UserRole;

  @IsBoolean()
  @Transform((param) => +param.value === 1)
  readonly isActive: boolean;

  @IsArray()
  @IsOptional()
  @ValidateNested()
  @Type(() => UserBranchDto)
  readonly branches?: UserBranchDto[];

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => SalesRepresentativeDto)
  readonly salesRepresentative?: SalesRepresentativeDto;

  @IsNumber()
  @IsOptional()
  readonly priceOrder?: number;

  @IsNumber()
  @IsOptional()
  readonly branch?: number;
}
