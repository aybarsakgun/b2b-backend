import {Field, ID, ObjectType} from "@nestjs/graphql";
import {Column, Entity, Index, PrimaryGeneratedColumn,} from "typeorm";
import {BaseModel} from "../common/models";

const CART_STOCK_CONTROL = 'cartStockControl';
const PRODUCTS_WITH_KDV = 'productsWithKdv';
const FIRST_PAGE_IS_LOGIN = 'firstPageIsLogin';

@ObjectType()
@Entity()
export class Setting extends BaseModel {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({length: 45, unique: true})
  key: string;

  @Field({nullable: true})
  @Column({type: "text", nullable: true})
  value?: string;

  constructor(partial: Partial<Setting> = {}) {
    super();
    Object.assign(this, partial);
  }
}
