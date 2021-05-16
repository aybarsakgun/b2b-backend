import {Injectable, NestMiddleware, UnauthorizedException} from '@nestjs/common';
import {Request, Response} from 'express';
import {AuthService} from "../../auth/auth.service";
import {IJwtPayload} from "../interfaces";
import {env} from "../env";
import {User} from "../../users/user.model";
import {verify} from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {
  }

  async use(req: Request, res: Response, next: () => void) {
    const bearerHeader = req.headers.authorization;
    const accessToken = bearerHeader && bearerHeader.split(' ')[1];

    if (!bearerHeader || !accessToken) {
      return next();
    }

    let user: User;

    try {
      const payload: IJwtPayload = verify(accessToken, env.JWT_SECRET) as IJwtPayload;
      user = await this.authService.validateUser(payload);
    } catch (error) {
      throw new UnauthorizedException('AUTH.INVALID_CREDENTIALS');
    }

    if (user) {
      req['user'] = user;
    }

    next();
  }
}
