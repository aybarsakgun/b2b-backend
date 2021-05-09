import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { BaseModel } from "../../common/models";
import { IUserBranch } from "./interfaces/user-branch.interface";
import { User } from "../user.model";

@ObjectType()
@Entity()
export class UserBranch extends BaseModel implements IUserBranch {
  @PrimaryColumn()
  @Field()
  id: number;

  @Field()
  @Column({ length: 255 })
  name: string;

  @ManyToOne(() => User, "branches", { orphanedRowAction: "delete" })
  user: User;

  constructor(partial: Partial<UserBranch> = {}) {
    super();
    Object.assign(this, partial);
  }
}
