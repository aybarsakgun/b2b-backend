import {CatalogSortingField} from "../types/catalog-sorting.input";
import {SortingType} from "../../common/enums/sorting-type.enum";

export interface ICatalogSorting {
  field: CatalogSortingField;
  order: SortingType;
}
