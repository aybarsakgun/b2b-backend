import { Field, ID, ObjectType } from "@nestjs/graphql";
import {
  Column,
  Entity,
  Index,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from "typeorm";
import { BaseModel } from "../../common/models";
import { Product } from "../product.model";

@ObjectType()
@Entity()
@Index(["parent"])
export class Category extends BaseModel {
  @Field(() => ID)
  @PrimaryColumn()
  id: number;

  @Field()
  @Column({ length: 255 })
  name: string;

  @Field()
  @Column({ length: 255 })
  description: string;

  @Field()
  @Column({ length: 255 })
  metaTitle: string;

  @Field()
  @Column({ length: 255 })
  metaDescription: string;

  @Field()
  @Column({ length: 255 })
  metaKeyword: string;

  @Field()
  @Column({ length: 255 })
  seo: string;

  @Field({ nullable: true })
  @Column({ nullable: true }) // TODO: nullable false. order gelmediği için geçici true yaptım.
  order: number;

  @Field(() => Category, { nullable: true })
  @ManyToOne(() => Category, (category) => category.children)
  parent: Category;

  @Field(() => [Category], {defaultValue: []})
  @OneToMany(() => Category, (category) => category.parent)
  children: Category[];

  @ManyToMany(() => Product, (product) => product.categories)
  products: Product[];

  @Field({nullable: true})
  @Column({ select: false, nullable: true })
  productCount?: number;

  constructor(partial: Partial<Category> = {}) {
    super();
    Object.assign(this, partial);
  }
}
