import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BaseModel } from "../../common/models";
import { Product } from "../product.model";
import { Model } from "../model/model.model";

@ObjectType()
@Entity()
export class Brand extends BaseModel {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ length: 255 })
  name: string;

  @Field()
  @Column({ length: 255 })
  code: string;

  @Field(() => [Model])
  @OneToMany(() => Model, (model) => model.brand)
  models: string;

  @Field(() => [Product])
  @OneToMany(() => Product, (product) => product.brand)
  products: Product[];

  constructor(partial: Partial<Brand> = {}) {
    super();
    Object.assign(this, partial);
  }
}
