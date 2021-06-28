import {DeleteResult, EntityRepository, SelectQueryBuilder} from "typeorm";
import {Cart} from "./cart.model";
import {User} from "../users/user.model";
import {BaseRepository} from "../common/repositories/base.repository";
import {INormalizedGqlRequestedPaths} from "../common/utils/normalize-gql-resolve-info";
import {ProductUtil} from "../product/product.util";

@EntityRepository(Cart)
export class CartRepository extends BaseRepository<Cart> {
  findCartItemsByUser(user: User, requestedPaths: INormalizedGqlRequestedPaths): SelectQueryBuilder<Cart> {
    const queryBuilder = this.createQueryBuilder(requestedPaths.root)
      .where(`${requestedPaths.root}.user = :user`, {user: user.id});
    return this.getPopulatedQuery(requestedPaths, queryBuilder, ProductUtil.fillJoinCondition(user));
  }

  async deleteAllCartItemsByUser(user: User): Promise<DeleteResult> {
    return this.createQueryBuilder('cart')
      .delete()
      .where('cart.user = :user', {user: user.id})
      .execute();
  }
}
