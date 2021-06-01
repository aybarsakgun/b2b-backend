import {Field, ID, ObjectType} from "@nestjs/graphql";
import {Column, Entity, ManyToOne, PrimaryGeneratedColumn,} from "typeorm";
import {BaseModel} from "../common/models";
import {Product} from "../product/product.model";
import {User} from "../users/user.model";
import {ProductUnit} from "../product/product-unit/product-unit.model";

@ObjectType()
@Entity()
export class Cart extends BaseModel {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  quantity: number;

  @Field(() => Product)
  @ManyToOne(() => Product)
  product: Product;

  @Field(() => User)
  @ManyToOne(() => User)
  user: User;

  @Field(() => ProductUnit)
  @ManyToOne(() => ProductUnit)
  productUnit: ProductUnit;

  constructor(partial: Partial<Cart> = {}) {
    super();
    Object.assign(this, partial);
  }
}
