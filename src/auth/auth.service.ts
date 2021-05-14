import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRepository } from "../users/user.repository";
import { LoginInput } from "./types/login.input";
import { Md5 } from "ts-md5";
import { LoginResult } from "./types/login-result";
import { User } from "../users/user.model";
import { IJwtPayload } from "../common/interfaces";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(payload: IJwtPayload): Promise<User> {
    return await this.userRepository.findOne(payload.id);
  }

  async login({ username, password }: LoginInput): Promise<LoginResult> {
    const user: User = await this.userRepository.findOne(
      { username },
      { relations: ["branches", "salesRepresentative"] }
    );

    if (!user) {
      throw new HttpException("Invalid credentials.", HttpStatus.UNAUTHORIZED);
    }

    if (Md5.hashStr(password) !== user.password) {
      throw new HttpException("Invalid credentials.", HttpStatus.UNAUTHORIZED);
    }

    // await new Promise(resolve => setTimeout(resolve, 2000)); // fake delay

    return {
      token: this.jwtService.sign({
        id: user.id,
      }),
      user: user,
    };
  }
}
