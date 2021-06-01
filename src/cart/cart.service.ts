import {Injectable, UnauthorizedException} from "@nestjs/common";
import {CartRepository} from "./cart.repository";
import {Cart} from "./cart.model";
import {User} from "../users/user.model";

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepository: CartRepository
  ) {
  }

  async getCart(user: User): Promise<Cart[]> {
    if (!user) {
      throw new UnauthorizedException('MAIN.UNAUTHORIZED');
    }
    return this.cartRepository.findCartItemsByUser(user);
  }
}
