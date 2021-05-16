import {Module} from "@nestjs/common";
import {PubSubService} from "./pub-sub.service";

@Module({
  providers: [PubSubService],
  exports: [PubSubService],
})
export class PubSubModule {}
