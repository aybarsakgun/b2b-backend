import {BadRequestException, Injectable, InternalServerErrorException} from "@nestjs/common";
import {SettingRepository} from "./setting.repository";
import {Setting} from "./setting.model";

@Injectable()
export class SettingService {
  constructor(
    private readonly settingRepository: SettingRepository
  ) {
  }

  async findAll(): Promise<Setting[]> {
    // await new Promise(resolve => setTimeout(resolve, 2000));
    // throw new InternalServerErrorException('500xd');
    return this.settingRepository.find();
  }

  async findByKey(key: string, defaultBooleanValue: boolean = false, returnBoolean?: boolean) {
    const setting = this.settingRepository.findByKey(key).getOne();
    if (returnBoolean) {
      return setting ? !!setting : defaultBooleanValue;
    }
    return setting;
  }
}
