import {Repository, SelectQueryBuilder} from "typeorm";
import {INormalizedGqlRequestedPaths} from "../utils/normalize-gql-resolve-info";

export abstract class BaseRepository<T> extends Repository<T> {
  constructor() {
    super();
  }

  getPopulatedQuery(
    requestedPaths: INormalizedGqlRequestedPaths,
    queryBuilder?: SelectQueryBuilder<T>,
    joinCondition?: (parent: string, child: string) => string
  ): SelectQueryBuilder<T> {
    const query = queryBuilder
      ? queryBuilder
      : this.createQueryBuilder(requestedPaths.root);
    requestedPaths.relations.forEach(([parent, child]) => {
      query.leftJoinAndSelect(`${parent}.${child}`, `${parent}__${child}`, joinCondition ? joinCondition(parent, child) : undefined);
    });
    return query;
  }
}
