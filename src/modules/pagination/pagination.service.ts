import {Injectable} from "@nestjs/common";
import {SelectQueryBuilder} from "typeorm";
import {IPaginationInput} from "./interfaces/pagination-input.interface";
import {IPaginationResult} from "./interfaces/pagination-result.interface";
import * as _ from "lodash";

@Injectable()
export class PaginationService {
  constructor() {
  }

  async paginate<T>(
    queryBuilder: SelectQueryBuilder<T>,
    paginationInput: IPaginationInput
  ): Promise<IPaginationResult<T>> {
    const createPaginationResult = (
      total: number,
      totalPage: number,
      page: number,
      limit: number,
      items: T[]
    ): Promise<IPaginationResult<T>> => {
      return Promise.resolve({
        total,
        totalPage,
        page,
        limit,
        items
      });
    };
    if (
      _.isEmpty(paginationInput) ||
      (!paginationInput.page && !paginationInput.limit)
    ) {
      const getItems: T[] = await queryBuilder.getMany();
      return createPaginationResult(getItems.length, null, null, null, getItems);
    }

    const {limit, page} = paginationInput;

    const getItems: T[] = await queryBuilder
      .take(limit)
      .skip((page - 1) * limit)
      .getMany();

    return createPaginationResult(getItems.length, Math.ceil(getItems.length / limit), page, limit, getItems);
  }
}
