import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {SettingResolver} from "./setting.resolver";
import {SettingService} from "./setting.service";
import {SettingRepository} from "./setting.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([SettingRepository])
  ],
  providers: [SettingResolver, SettingService],
  exports: [SettingService]
})
export class SettingModule {
}
