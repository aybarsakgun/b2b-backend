import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, PrimaryColumn } from "typeorm";
import { ISalesRepresentative } from "./interfaces/sales-representative.interface";
import { BaseModel } from "../../common/models";

@ObjectType()
@Entity()
export class SalesRepresentative
  extends BaseModel
  implements ISalesRepresentative {
  @PrimaryColumn()
  @Field()
  id: number;

  @Field()
  @Column({ length: 255 })
  name: string;

  @Field()
  @Column({ length: 25 })
  phone: string;

  @Field()
  @Column({ length: 50 })
  email: string;
}
