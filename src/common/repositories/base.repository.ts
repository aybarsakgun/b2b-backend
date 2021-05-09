import {Repository, SelectQueryBuilder} from "typeorm";
import {INormalizedGqlRequestedPaths} from "../utils/normalize-gql-resolve-info";

export abstract class BaseRepository<T> extends Repository<T> {
  constructor() {
    super()
  }

  getPopulatedQuery(requestedPaths: INormalizedGqlRequestedPaths): SelectQueryBuilder<T> {
    const query = this.createQueryBuilder(requestedPaths.root);
    requestedPaths.relations.forEach(([parent, child]) => {
      query.leftJoinAndSelect(`${parent}.${child}`, `${parent}__${child}`);
    });
    return query;
  }
}
