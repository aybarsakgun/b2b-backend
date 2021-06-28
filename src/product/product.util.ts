import {User} from "../users/user.model";

export class ProductUtil {
  static fillJoinCondition = (user: User) => {
    return (parent: string, child: string) => {
      if (child === 'defaultPrice') {
        return `${parent}__${child}.priceOrder = ${user?.priceOrder ?? parent + '.defaultPriceOrder'}`;
      } else if (child === 'listPrice') {
        return `${parent}__${child}.priceOrder = ${parent + '.listPriceOrder'}`;
      }
    }
  }
}
