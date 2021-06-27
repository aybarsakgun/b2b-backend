import {IPriceRange} from "../../common/interfaces/price-range.interface";

export interface ICatalogFilters {
  brands: number[];
  models: number[];
  category: number;
  priceRange: IPriceRange;
}
