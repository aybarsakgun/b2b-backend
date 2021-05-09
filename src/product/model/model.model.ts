import {Field, ID, ObjectType} from "@nestjs/graphql";
import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn,} from "typeorm";
import {BaseModel} from "../../common/models";
import {Product} from "../product.model";
import {Brand} from "../brand/brand.model";

@ObjectType()
@Entity()
export class Model extends BaseModel {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ length: 255 })
  name: string;

  @Field(() => Brand)
  @ManyToOne(() => Brand, (brand) => brand.models)
  brand: Brand;

  @OneToMany(() => Product, (product) => product.model)
  products: Product[];

  constructor(partial: Partial<Model> = {}) {
    super();
    Object.assign(this, partial);
  }
}
