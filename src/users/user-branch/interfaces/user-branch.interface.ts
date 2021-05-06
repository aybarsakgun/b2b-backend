import { IBase } from "../../../common/interfaces";
import {User} from "../../user.model";

export interface IUserBranch extends IBase {
  id: number;
  name: string;
  user: User;
}
