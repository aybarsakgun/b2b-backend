import {Field, InputType, registerEnumType} from "@nestjs/graphql";
import {IsOptional} from "class-validator";
import {SortingType} from "../../common/enums/sorting-type.enum";

export enum CatalogSortingField {
  PRODUCT_NAME = 'PRODUCT_NAME',
  PRODUCT_PRICE = 'PRODUCT_PRICE',
  PRODUCT_QUANTITY = 'PRODUCT_QUANTITY',
  PRODUCT_BRAND = 'PRODUCT_BRAND'
}

registerEnumType(CatalogSortingField, {
  name: 'CatalogSortingField',
});

@InputType()
export class CatalogSortingInput {
  @Field(() => CatalogSortingField, {defaultValue: CatalogSortingField.PRODUCT_NAME})
  @IsOptional()
  field: CatalogSortingField;

  @Field(() => SortingType, {defaultValue: SortingType.ASC})
  @IsOptional()
  order: SortingType;
}
