import {Body, Controller, ParseArrayPipe, Post} from "@nestjs/common";
import {UserDto} from "./dtos/user.dto";
import {TransferService} from "./transfer.service";
import {Public} from "../common/decorators";

// @AdminGuard()
@Public()
@Controller('api/transfer')
export class TransferController {
  constructor(
    private transferService: TransferService
  ) {
  }

  @Post('users')
  async userTransfer(
    @Body(new ParseArrayPipe({
      items: UserDto,
      transformOptions: {
        enableImplicitConversion: true
      }
    })) data: UserDto[]) {
    return this.transferService.importUsers(data);
  }
}
