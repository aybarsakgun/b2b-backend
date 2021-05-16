import {IsString} from "class-validator";

export class CurrencyDto {
  @IsString()
  readonly code: string;

  @IsString()
  readonly name: string;

  @IsString()
  readonly symbol: string;

  @IsString()
  readonly exchangeRate: string;
}
