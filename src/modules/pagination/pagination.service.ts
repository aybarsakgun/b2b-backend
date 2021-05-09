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
    paginationInput: IPaginationInput
  ): Promise<IPaginationResult<T>> {
    if (
      _.isEmpty(paginationInput) ||
      (!paginationInput.page && !paginationInput.limit)
    ) {
      return Promise.resolve({
        total: null,
        totalPage: null,
        page: null,
        limit: null,
        items: await queryBuilder.getMany(),
      } as IPaginationResult<T>);
    }

    const { limit, page } = paginationInput;

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

    const countQuery = `SELECT COUNT(*) as count FROM (${query}) AS tbl`;
    const countResult = await this.entityManager.connection.query(countQuery);

    const total = +countResult[0].count;

    const items = await queryBuilder
      .take(limit)
      .skip((page - 1) * limit)
      .getMany();

    return Promise.resolve({
      total,
      totalPage: Math.ceil(total / limit),
      page: +page,
      limit,
      items: items,
    } as IPaginationResult<T>);
  }
}
