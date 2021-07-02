import {registerEnumType} from "@nestjs/graphql";

export enum SortingType {
  ASC = 'ASC',
  DESC = 'DESC'
}

registerEnumType(SortingType, {
  name: 'SortingType',
});
