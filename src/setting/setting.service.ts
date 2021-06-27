import {Injectable} from "@nestjs/common";
import {SettingRepository} from "./setting.repository";
import {Setting} from "./setting.model";
import {SettingEnums} from "../common/enums/settings.enum";

@Injectable()
export class SettingService {
  constructor(
    private readonly settingRepository: SettingRepository
  ) {
  }

  async findAll(): Promise<Setting[]> {
    return this.settingRepository.find();
  }

  async findByKey(key: SettingEnums, defaultBooleanValue: boolean = false, returnBoolean?: boolean) {
    const setting = await this.settingRepository.findByKey(key).getOne();
    if (returnBoolean) {
      return setting ? !!setting.value : defaultBooleanValue;
    }
    return setting;
  }
}
