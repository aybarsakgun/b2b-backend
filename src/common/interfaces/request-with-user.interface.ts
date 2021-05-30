import {Request} from 'express';
import {User} from "../../users/user.model";

export class IRequestWithUser extends Request {
  user: Partial<User>;
}
