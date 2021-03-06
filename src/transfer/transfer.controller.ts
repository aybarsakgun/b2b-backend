import { Body, Controller, ParseArrayPipe, Post } from "@nestjs/common";
import { UserDto } from "./dtos/user.dto";
import { TransferService } from "./transfer.service";
import { Public } from "../common/decorators";
import { ProductDto } from "./dtos/product.dto";
import {SettingDto} from "./dtos/setting.dto";
import {CurrencyDto} from "./dtos/currency.dto";

// @AdminGuard()
@Public()
@Controller("api/transfer")
export class TransferController {
  constructor(private transferService: TransferService) {}

  @Post("users")
  async importUsers(
    @Body(
      new ParseArrayPipe({
        items: UserDto,
        transformOptions: {
          enableImplicitConversion: true,
        },
      })
    )
    data: UserDto[]
  ) {
    return this.transferService.importUsers(data);
  }

  @Post("products")
  async importProducts(
    @Body(
      new ParseArrayPipe({
        items: ProductDto,
        transformOptions: {
          enableImplicitConversion: true,
        },
      })
    )
    data: ProductDto[]
  ) {
    return this.transferService.importProducts(data);
  }

  @Post("settings")
  async importSettings(
    @Body(
      new ParseArrayPipe({
        items: SettingDto,
        transformOptions: {
          enableImplicitConversion: true,
        },
      })
    )
      data: SettingDto[]
  ) {
    return this.transferService.importSettings(data);
  }

  @Post("currencies")
  async importCurrencies(
    @Body(
      new ParseArrayPipe({
        items: CurrencyDto,
        transformOptions: {
          enableImplicitConversion: true,
        },
      })
    )
      data: CurrencyDto[]
  ) {
    return this.transferService.importCurrencies(data);
  }
}
