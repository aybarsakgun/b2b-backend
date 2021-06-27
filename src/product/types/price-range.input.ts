import {Field, InputType,} from "@nestjs/graphql";
import {IsBoolean, IsNumberString, IsString} from "class-validator";

@InputType()
export class PriceRangeInput {
  @Field({nullable: true})
  @IsNumberString()
  min?: string;

  @Field({nullable: true})
  @IsNumberString()
  max?: string;

  @Field()
  @IsString()
  currency: string;

  @Field({defaultValue: false})
  @IsBoolean()
  vatIncluded?: boolean;
}
