import { UserRole } from "../user.model";
import { IBase } from "../../common/interfaces";
import { ISalesRepresentative } from "../sales-representative/interfaces/sales-representative.interface";
import {UserBranch} from "../user-branch/user-branch.model";

export interface IUser extends IBase {
  id: string;
  username: string;
  password: string;
  email: string;
  currency: string;
  name: string;
  customerId: number;
  role: UserRole;
  isActive: boolean;
  branches: UserBranch[];
  salesRepresentative: ISalesRepresentative;
  priceOrder: number;
  branch: number;
}
