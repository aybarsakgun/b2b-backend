import { IBase } from "../../../common/interfaces";

export interface ISalesRepresentative extends IBase {
  id: number;
  name: string;
  phone: string;
  email: string;
}
