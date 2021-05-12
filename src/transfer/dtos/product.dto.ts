import {
  IsArray,
  IsNumber,
  IsNumberString,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class CategoryDto {
  @IsNumber()
  readonly id: number;

  @IsString()
  readonly name: string;

  @IsString()
  readonly description: string;

  @IsString()
  readonly metaTitle: string;

  @IsString()
  readonly metaDescription: string;

  @IsString()
  readonly metaKeyword: string;

  @IsString()
  readonly seo: string;

  @IsNumber()
  @IsOptional()
  readonly order?: number;

  @IsArray()
  @IsOptional()
  @ValidateNested()
  @Type(() => CategoryDto)
  readonly children?: CategoryDto[];
}

export class WarehouseDto {
  @IsNumberString()
  readonly quantity: string;

  @IsNumber()
  readonly warehouseId: number;

  @IsString()
  readonly date: string;

  @IsString()
  readonly warehouseName: string;
}

export class ProductPriceDto {
  @IsNumberString()
  @IsOptional()
  readonly value?: string;

  @IsString()
  @IsOptional()
  readonly currency?: string;

  @IsNumber()
  readonly priceOrder: number;
}

export class ProductUnitDto {
  @IsString()
  readonly value: string;

  @IsString()
  @IsOptional()
  readonly barcode?: string;

  @IsNumber()
  readonly defaultPriceOrder: number;

  @IsNumber()
  readonly listPriceOrder: number;

  @IsNumberString()
  readonly multiplier: string;

  @IsNumberString()
  @IsOptional()
  readonly length?: string;

  @IsNumberString()
  @IsOptional()
  readonly width?: string;

  @IsNumberString()
  @IsOptional()
  readonly height?: string;

  @IsNumberString()
  @IsOptional()
  readonly weight?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested()
  @Type(() => ProductPriceDto)
  readonly prices?: ProductPriceDto[];
}

export class ProductDto {
  @IsNumber()
  readonly id: number;

  @IsString()
  readonly code: string;

  @IsString()
  @IsOptional()
  readonly equivalentCode?: string;

  @IsString()
  readonly name: string;

  @IsString()
  readonly metaDescription: string;

  @IsString()
  readonly metaTitle: string;

  @IsString()
  readonly metaKeywords: string;

  @IsString()
  readonly description: string;

  @IsString()
  readonly seo: string;

  @IsString()
  readonly defaultUnit: string;

  @IsNumber()
  readonly quantity: number;

  @IsNumber()
  readonly taxRate: number;

  @IsString()
  @IsOptional()
  readonly image: string;

  @IsArray()
  @IsOptional()
  @ValidateNested()
  @Type(() => ProductUnitDto)
  readonly units?: ProductUnitDto[];

  @IsArray()
  @IsOptional()
  @ValidateNested()
  @Type(() => WarehouseDto)
  readonly warehouses?: WarehouseDto[];

  @IsArray()
  @IsOptional()
  @ValidateNested()
  @Type(() => CategoryDto)
  readonly categories?: CategoryDto[];

  @IsArray()
  @IsOptional()
  @ValidateNested()
  @Type(() => ProductDto)
  readonly children?: ProductDto[];

  @IsString()
  @IsOptional()
  readonly model?: string;

  @IsString()
  @IsOptional()
  readonly brand?: string;

  @IsString()
  readonly currency: string;
}
