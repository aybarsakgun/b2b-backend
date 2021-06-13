import { Injectable } from "@nestjs/common";
import { EntityManager, SelectQueryBuilder } from "typeorm";
import { IPaginationInput } from "./interfaces/pagination-input.interface";
import { IPaginationResult } from "./interfaces/pagination-result.interface";
import * as _ from "lodash";

@Injectable()
export class PaginationService {
  constructor(private entityManager: EntityManager) {}

  async paginate<T>(
    queryBuilder: SelectQueryBuilder<T>,
    paginationInput: IPaginationInput,
    manipulateFn?: (...params: any) => T
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
        items,
      });
    };
    if (
      _.isEmpty(paginationInput) ||
      (!paginationInput.page && !paginationInput.limit)
    ) {
      const getItems: T[] = await queryBuilder.getMany();
      return createPaginationResult(
        getItems.length,
        null,
        null,
        null,
        getItems
      );
    }

    let { limit, page } = paginationInput;

    limit = +limit || 10;
    page = +page || 1;

    let query = queryBuilder.getQuery();
    const parameters = queryBuilder.getParameters();
    if (Object.values(parameters).length) {
      Object.keys(parameters).forEach((key) => {
        const regexp = (key) => new RegExp(`:${key}`, "g");
        if (Array.isArray(parameters[key])) {
          const val = (parameters[key] as string[]).join(",");
          query = query.replace(regexp(key), val);
        } else {
          query = query.replace(regexp(key), parameters[key]);
        }
      });
    }

    const countQuery = `SELECT COUNT(DISTINCT ${queryBuilder.alias}_id) as count FROM (${query}) AS tbl`;
    const countResult = await this.entityManager.connection.query(countQuery);

    const total = +countResult[0].count;

    const getItems: T[] = await queryBuilder
      .take(limit)
      .skip((page - 1) * limit)
      .getMany();

    return createPaginationResult(
      total,
      Math.ceil(total / limit),
      page,
      limit,
      manipulateFn ? getItems.map(manipulateFn) : getItems
    );
  }
}
