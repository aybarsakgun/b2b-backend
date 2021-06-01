import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {CartRepository} from "./cart.repository";
import {CartService} from "./cart.service";
import {CartResolver} from "./cart.resolver";
import {ProductRepository} from "../product/product.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([CartRepository, ProductRepository])
  ],
  providers: [CartResolver, CartService]
})
export class CartModule {
}
