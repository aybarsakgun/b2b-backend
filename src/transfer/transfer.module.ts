import { Module } from "@nestjs/common";
import { TransferController } from "./transfer.controller";
import { TransferService } from "./transfer.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserRepository } from "../users/user.repository";

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository])],
  providers: [TransferService],
  controllers: [TransferController],
})
export class TransferModule {}
