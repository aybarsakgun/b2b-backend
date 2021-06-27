import {Field, ID, ObjectType} from "@nestjs/graphql";
import {Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn,} from "typeorm";
import {BaseModel} from "../../common/models";
import {Product} from "../product.model";

@ObjectType()
@Entity()
@Index(["product", "warehouseId"], {unique: true})
export class Warehouse extends BaseModel {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.warehouses)
  product: Product;

  @Field()
  @Column({length: 16})
  quantity: string;

  @Field()
  @Column()
  warehouseId: number;

  @Field()
  @Column()
  date: string;

  @Field()
  @Column({length: 255})
  warehouseName: string;

  constructor(partial: Partial<Warehouse> = {}) {
    super();
    Object.assign(this, partial);
  }
}
