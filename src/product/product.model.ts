import { Field, ID, ObjectType } from "@nestjs/graphql";
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from "typeorm";
import { ProductUnit } from "./product-unit/product-unit.model";
import { BaseModel } from "../common/models";
import { Warehouse } from "./warehouse/warehouse.model";
import { Model } from "./model/model.model";
import { Brand } from "./brand/brand.model";
import { Category } from "./category/category.model";

@ObjectType()
@Entity()
@Index(["seo", "parent", "name", "code"], { unique: true })
export class Product extends BaseModel {
  @Field(() => ID)
  @PrimaryColumn()
  id: number;

  @Field()
  @Column({ length: 255 })
  code: string;

  @Field()
  @Column({ type: "text", nullable: true })
  equivalentCode?: string;

  @Field()
  @Column({ length: 255 })
  name: string;

  @Field()
  @Column({ length: 255 })
  metaDescription: string;

  @Field()
  @Column({ length: 255 })
  metaTitle: string;

  @Field()
  @Column({ length: 255 })
  metaKeywords: string;

  @Field()
  @Column({ type: "longtext" })
  description: string;

  @Field()
  @Column({ length: 255 })
  seo: string;

  @Field()
  @Column({ length: 255 })
  defaultUnit: string;

  @Field()
  @Column()
  quantity: number;

  @Field()
  @Column({ type: "smallint" })
  taxRate: number;

  @Field()
  @Column({ length: 255, nullable: true })
  image?: string;

  @Field(() => Product)
  @ManyToOne(() => Product, (product) => product.children)
  parent: Product;

  @Field(() => Product)
  @OneToMany(() => Product, (product) => product.parent)
  children: Product;

  @Field(() => [ProductUnit])
  @OneToMany(() => ProductUnit, (productUnit) => productUnit.product)
  units: ProductUnit[];

  @Field(() => [Warehouse])
  @OneToMany(() => Warehouse, (warehouse) => warehouse.product)
  warehouses: Warehouse[];

  // @Field(() => Image)
  // @OneToMany(() => Image, 'product', {cascade: true, orphanedRowAction: "delete"})
  // images: Image[];

  @Field(() => [Category])
  @ManyToMany(() => Category, (category) => category.products)
  @JoinTable({ name: "product_to_category" })
  categories: Category[];

  @Field(() => Model, { nullable: true })
  @ManyToOne(() => Model, (model) => model.products)
  model: Model;

  @Field(() => Brand, { nullable: true })
  @ManyToOne(() => Brand, (brand) => brand.products)
  brand: Brand;

  @Field()
  @Column({ length: 4 })
  currency: string;

  constructor(partial: Partial<Product> = {}) {
    super();
    Object.assign(this, partial);
  }
}
