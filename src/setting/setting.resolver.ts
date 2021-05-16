import {Query, Resolver} from "@nestjs/graphql";
import {Public} from "../common/decorators";
import {SettingService} from "./setting.service";
import {Setting} from "./setting.model";

@Resolver()
@Public()
export class SettingResolver {
  constructor(private readonly settingService: SettingService) {
  }

  @Query(() => [Setting], {name: "settings"})
  async getSettings(): Promise<Setting[]> {
    return this.settingService.findAll();
  }
}
