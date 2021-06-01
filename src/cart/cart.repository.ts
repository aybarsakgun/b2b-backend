import {DeleteResult, EntityRepository, Repository} from "typeorm";
import {Cart} from "./cart.model";
import {User} from "../users/user.model";

@EntityRepository(Cart)
export class CartRepository extends Repository<Cart> {
  async findCartItemsByUser(user: User): Promise<Cart[]> {
    return this.createQueryBuilder('cart')
      .where('cart.user = :user', {user: user.id})
      .getMany();
  }

  async deleteAllCartItemsByUser(user: User): Promise<DeleteResult> {
    return this.createQueryBuilder('cart')
      .delete()
      .where('cart.user = :user', {user: user.id})
      .execute();
  }
}
