import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {CartRepository} from "./cart.repository";
import {CartService} from "./cart.service";
import {CartResolver} from "./cart.resolver";

@Module({
  imports: [
    TypeOrmModule.forFeature([CartRepository])
  ],
  providers: [CartResolver, CartService]
})
export class CartModule {
}
