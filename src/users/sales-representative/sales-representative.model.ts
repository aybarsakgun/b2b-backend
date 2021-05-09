import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { ISalesRepresentative } from "./interfaces/sales-representative.interface";
import { BaseModel } from "../../common/models";
import { User } from "../user.model";

@ObjectType()
@Entity()
export class SalesRepresentative
  extends BaseModel
  implements ISalesRepresentative {
  @PrimaryColumn()
  @Field()
  id: number;

  @Field({ nullable: true })
  @Column({ length: 255, default: null, nullable: true })
  name: string;

  @Field({ nullable: true })
  @Column({ length: 25, default: null, nullable: true })
  phone: string;

  @Field({ nullable: true })
  @Column({ length: 50, default: null, nullable: true })
  email: string;

  @Field(() => [User])
  @OneToMany(() => User, (User) => User.salesRepresentative, {
    orphanedRowAction: "delete",
  })
  users: User[];

  constructor(partial: Partial<SalesRepresentative> = {}) {
    super();
    Object.assign(this, partial);
  }
}
