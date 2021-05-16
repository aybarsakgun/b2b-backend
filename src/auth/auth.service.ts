import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {UserRepository} from "../users/user.repository";
import {LoginInput} from "./types/login.input";
import {Md5} from "ts-md5";
import {LoginResult} from "./types/login-result";
import {User} from "../users/user.model";
import {IJwtPayload} from "../common/interfaces";
import {sign} from 'jsonwebtoken';
import {env} from "../common/env";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository
  ) {
  }

  async validateUser(payload: IJwtPayload): Promise<User> {
    return await this.userRepository.findOne(payload.id);
  }

  async login({username, password}: LoginInput): Promise<LoginResult> {
    const user: User = await this.userRepository.findOne(
      {username},
      {relations: ["branches", "salesRepresentative"]}
    );

    if (!user) {
      throw new HttpException("AUTH.INVALID_CREDENTIALS", HttpStatus.UNAUTHORIZED);
    }

    if (Md5.hashStr(password) !== user.password) {
      throw new HttpException("AUTH.INVALID_CREDENTIALS", HttpStatus.UNAUTHORIZED);
    }

    // await new Promise(resolve => setTimeout(resolve, 2000)); // fake delay

    return {
      token: sign({
        id: user.id,
      }, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRES_IN
      }),
      user: user,
    };
  }
}
