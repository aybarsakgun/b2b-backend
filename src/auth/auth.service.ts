import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRepository } from "../users/user.repository";
import { SignInInput } from "./dto/sign-in.input";
import { Md5 } from "ts-md5";
import { SignInResult } from "./dto/sign-in-result";
import { JWTPayload } from "./jwt.strategy";
import { User } from "../users/user.model";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService
  ) {}

  async signIn({ email, password }: SignInInput): Promise<SignInResult> {
    const user: User = await this.userRepository.findOne({ email });

    if (!user) {
      throw new HttpException("Invalid credentials.", HttpStatus.UNAUTHORIZED);
    }

    if (Md5.hashStr(password) !== user.password) {
      throw new HttpException("Invalid credentials.", HttpStatus.UNAUTHORIZED);
    }

    const payload: JWTPayload = {
      id: user.id,
    };

    return {
      token: this.jwtService.sign(payload),
      user: user,
    };
  }
}
