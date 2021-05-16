import {EntityRepository, Repository} from "typeorm";
import {Setting} from "./setting.model";

@EntityRepository(Setting)
export class SettingRepository extends Repository<Setting> {
  findByKey(key: string) {
    return this.createQueryBuilder('setting')
      .where('setting.key = :key', {key})
  }
}
