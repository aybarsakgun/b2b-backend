import {Field, ID, ObjectType} from "@nestjs/graphql";
import {Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {ProductPrice} from "../product-price/product-price.model";
import {Product} from "../product.model";
import {BaseModel} from "../../common/models";

@ObjectType()
@Entity()
@Index(['value', 'product'], {unique: true})
export class ProductUnit extends BaseModel {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({length: 20})
  value: string;

  @Field({nullable: true})
  @Column({length: 45, nullable: true})
  barcode?: string;

  @Field()
  @Column()
  defaultPriceOrder: number;

  @Field()
  @Column()
  listPriceOrder: number;

  @Field()
  @Column({type: "decimal", precision: 13, scale: 4})
  multiplier: number;

  @Field({nullable: true})
  @Column({type: "decimal", precision: 15, scale: 8, nullable: true})
  length?: number;

  @Field({nullable: true})
  @Column({type: "decimal", precision: 15, scale: 8, nullable: true})
  width?: number;

  @Field({nullable: true})
  @Column({type: "decimal", precision: 15, scale: 8, nullable: true})
  height?: number;

  @Field({nullable: true})
  @Column({type: "decimal", precision: 15, scale: 8, nullable: true})
  weight?: number;

  @Field(() => Product)
  @ManyToOne(() => Product, product => product.units)
  product: Product;

  @Field(() => [ProductPrice])
  @OneToMany(() => ProductPrice, productPrice => productPrice.unit)
  prices: ProductPrice[];

  constructor(partial: Partial<ProductUnit> = {}) {
    super();
    Object.assign(this, partial);
  }
}
