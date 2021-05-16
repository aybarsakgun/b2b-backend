import {Query, Resolver} from "@nestjs/graphql";
import {Public} from "../common/decorators";
import {Currency} from "./currency.model";
import {CurrencyService} from "./currency.service";

@Resolver()
@Public()
export class CurrencyResolver {
  constructor(private readonly currencyService: CurrencyService) {
  }

  @Query(() => [Currency], {name: "currencies"})
  async getCurrencies(): Promise<Currency[]> {
    return this.currencyService.findAll();
  }
}
