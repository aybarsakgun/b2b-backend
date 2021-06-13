import {ProductUnit} from "./product-unit.model";
import {User} from "../../users/user.model";

export class ProductUnitMapper {
  static mapByUser(user: User) {
    return (productUnit: ProductUnit) => {
      const defaultPriceOrder: number = user?.priceOrder || productUnit.defaultPriceOrder;
      return {
        ...productUnit,
        defaultPriceOrder: defaultPriceOrder,
        prices: productUnit.prices?.filter(price => price.priceOrder === defaultPriceOrder || price.priceOrder === productUnit.listPriceOrder) || []
      }
    }
  }
}
