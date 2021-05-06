import {BadRequestException, Injectable} from "@nestjs/common";
import {UserDto} from "./dtos/user.dto";
import {User} from "../users/user.model";
import {Connection, In} from "typeorm";

@Injectable()
export class TransferService {
  constructor(
    private connection: Connection
  ) {
  }

  async importUsers(data: UserDto[]) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const users = await queryRunner.manager.getRepository(User).createQueryBuilder('user').select('user.customerId').getMany();
      const willBeDeleteUsers = users.filter(user => !data.some(userDto => userDto.customerId === user.customerId)).map(user => user.customerId);
      if (willBeDeleteUsers.length) {
        await queryRunner.manager.getRepository(User).delete({customerId: In(willBeDeleteUsers)});
      }
      for (const userDto of data) {
        let user = await queryRunner.manager.getRepository(User).findOne({customerId: +userDto.customerId});
        if (!user) {
          user = new User();
        }
        await queryRunner.manager.save(Object.assign(user, userDto));
      }
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(e?.message);
    } finally {
      await queryRunner.release();
    }
    return true;
  }
}
