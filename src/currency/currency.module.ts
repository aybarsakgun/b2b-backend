import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {CurrencyRepository} from "./currency.repository";
import {CurrencyResolver} from "./currency.resolver";
import {CurrencyService} from "./currency.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([CurrencyRepository])
  ],
  providers: [CurrencyResolver, CurrencyService],
  exports: [CurrencyService]
})
export class CurrencyModule {
}
