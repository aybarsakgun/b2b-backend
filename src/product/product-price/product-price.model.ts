import {Field, ID, ObjectType} from "@nestjs/graphql";
import {Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn,} from "typeorm";
import {ProductUnit} from "../product-unit/product-unit.model";
import {BaseModel} from "../../common/models";

@ObjectType()
@Entity()
@Index(["priceOrder", "unit"], {unique: true})
export class ProductPrice extends BaseModel {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({length: 45, nullable: true})
  value?: string;

  @Field()
  @Column({length: 4, nullable: true})
  currency?: string;

  @Field()
  @Column()
  priceOrder: number;
  
  @ManyToOne(() => ProductUnit, (productUnit) => productUnit.prices)
  unit: ProductUnit;

  constructor(partial: Partial<ProductPrice> = {}) {
    super();
    Object.assign(this, partial);
  }
}
