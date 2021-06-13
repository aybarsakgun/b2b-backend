import {Product} from "./product.model";
import {User} from "../users/user.model";
import {ProductUnitMapper} from "./product-unit/product-unit.mapper";

export class ProductMapper {
  static mapByUser(user: User) {
    return (product: Product) => {
      return {
        ...product,
        units: product.units?.map(ProductUnitMapper.mapByUser(user)) || []
      }
    }
  }
}
