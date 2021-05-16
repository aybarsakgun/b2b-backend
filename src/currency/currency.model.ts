import {Field, ID, ObjectType} from "@nestjs/graphql";
import {Column, Entity, PrimaryGeneratedColumn,} from "typeorm";
import {BaseModel} from "../common/models";

@ObjectType()
@Entity()
export class Currency extends BaseModel {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({length: 4})
  code: string;

  @Field()
  @Column({length: 128})
  name: string;

  @Field()
  @Column({length: 64})
  symbol: string;

  @Field()
  @Column({type: "decimal", precision: 13, scale: 6})
  exchangeRate: string;

  constructor(partial: Partial<Currency> = {}) {
    super();
    Object.assign(this, partial);
  }
}
