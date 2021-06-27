import {Injectable} from "@nestjs/common";
import {CurrencyRepository} from "./currency.repository";
import {Currency} from "./currency.model";

@Injectable()
export class CurrencyService {
  constructor(
    private readonly currencyRepository: CurrencyRepository
  ) {
  }

  async findAll(): Promise<Currency[]> {
    return await this.currencyRepository.find();
  }

  async findByCode(code: string): Promise<Currency> {
    return await this.currencyRepository.findOne({code});
  }
}
