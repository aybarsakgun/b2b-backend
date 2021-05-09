import {Field, ID, ObjectType, registerEnumType} from "@nestjs/graphql";
import {Column, Entity, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {SalesRepresentative} from "./sales-representative/sales-representative.model";
import {IUser} from "./interfaces/user.interface";
import {BaseModel} from "../common/models";
import {UserBranch} from "./user-branch/user-branch.model";

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

registerEnumType(UserRole, {
  name: "UserRole",
});

@ObjectType()
@Entity()
export class User extends BaseModel implements IUser {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ length: 25, unique: true })
  username: string;

  @Column({ length: 64 })
  password: string;

  @Field()
  @Column({ length: 255 })
  email: string;

  @Field()
  @Column({ length: 4 })
  currency: string;

  @Field()
  @Column({ length: 255 })
  name: string;

  @Field()
  @Column()
  customerId: number;

  @Field(() => UserRole)
  @Column({ type: "enum", enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Field()
  @Column()
  isActive: boolean;

  @Field(() => [UserBranch])
  @OneToMany(() => UserBranch, UserBranch => UserBranch.user, {cascade: true})
  branches: UserBranch[];

  @Field(() => SalesRepresentative, { nullable: true })
  @ManyToOne(() => SalesRepresentative, {cascade: true})
  salesRepresentative: SalesRepresentative;

  @Field({ nullable: true })
  @Column({ default: null, nullable: true })
  priceOrder: number;

  @Field({ nullable: true })
  @Column({ default: null, nullable: true })
  branch: number;

  constructor(partial: Partial<User> = {}) {
    super();
    Object.assign(this, partial);
  }
}
