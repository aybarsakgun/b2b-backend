import {EntityRepository, Repository} from "typeorm";
import {Currency} from "./currency.model";

@EntityRepository(Currency)
export class CurrencyRepository extends Repository<Currency> {
}
