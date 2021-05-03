import { Field, ID, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Exclude } from "class-transformer";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { SalesRepresentative } from "./sales-representative/sales-representative.model";
import { IUser } from "./interfaces/user.interface";
import { IsEmail } from "class-validator";
import { BaseModel } from "../common/models";

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
  @Field((type) => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column({ length: 25, unique: true })
  username: string;

  @Column({ length: 64 })
  @Exclude()
  password: string;

  @Field()
  @IsEmail()
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

  // @Field(() => [CustomerBranch])
  // @OneToMany(() => CustomerBranch, customerBranch => customerBranch.users)
  // customerBranches: CustomerBranch[];

  @Field(() => SalesRepresentative, { nullable: true })
  @ManyToOne(() => SalesRepresentative)
  salesRepresentative: SalesRepresentative;

  @Field({ nullable: true })
  @Column({ default: null, nullable: true })
  priceOrder: number;

  @Field({ nullable: true })
  @Column({ default: null, nullable: true })
  branch: number;
}
