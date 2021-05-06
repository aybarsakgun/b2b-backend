import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {InjectRepository} from "@nestjs/typeorm";
import {UserRepository} from "../users/user.repository";
import {SignInInput} from "./types/sign-in.input";
import {Md5} from "ts-md5";
import {SignInResult} from "./types/sign-in-result";
import {User} from "../users/user.model";
import {IJwtPayload} from "../common/interfaces";

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
  
  async signIn({ email, password }: SignInInput): Promise<SignInResult> {
    const user: User = await this.userRepository.findOne({ email });

    if (!user) {
      throw new HttpException("Invalid credentials.", HttpStatus.UNAUTHORIZED);
    }

    if (Md5.hashStr(password) !== user.password) {
      throw new HttpException("Invalid credentials.", HttpStatus.UNAUTHORIZED);
    }

    return {
      token: this.jwtService.sign({
        id: user.id
      }),
      user: user,
    };
  }
}
