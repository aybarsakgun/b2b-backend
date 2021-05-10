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

  @Field(() => [Model], {defaultValue: []})
  @OneToMany(() => Model, (model) => model.brand)
  models: string;

  @OneToMany(() => Product, (product) => product.brand)
  products: Product[];

  @Field({nullable: true})
  @Column({ select: false, nullable: true })
  productCount?: number;

  constructor(partial: Partial<Brand> = {}) {
    super();
    Object.assign(this, partial);
  }
}
