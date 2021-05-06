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

        // user.username = userDto.username;
        // user.password = userDto.password;
        // user.email = userDto.email;
        // user.currency = userDto.currency;
        // user.name = userDto.name;
        // user.customerId = userDto.customerId;
        // user.role = userDto.roles;
        // user.isActive = userDto.isActive;
        // user.priceOrder = userDto.priceOrder;
        // user.branch = userDto.branch;

        // if (userDto.branches) {
        //   if (user.id) {
        //     await queryRunner.manager.getRepository(UserBranch).delete({user: user});
        //   }
        //   user.branches = userDto.branches.map(branch => {
        //     const newUserBranch = new UserBranch();
        //     return {
        //       id: +branch.id,
        //       name: branch.name,
        //       ...newUserBranch
        //     }
        //   });
        // }
        //
        // if (userDto.salesRepresentative) {
        //   const newSalesRepresentative = new SalesRepresentative();
        //   user.salesRepresentative = {
        //     id: +userDto.salesRepresentative.id,
        //     name: userDto.salesRepresentative.name,
        //     email: userDto.salesRepresentative.email,
        //     phone: userDto.salesRepresentative.phone,
        //     ...newSalesRepresentative
        //   };
        // }

        // if (userDto.branches && userDto.branches.length) {
        //   for (const branchDto of userDto.branches) {
        //     if (user.branches && user.branches.length) {
        //       const checkBranchExisting = user.branches.find(branch => branch.id === +branchDto.id);
        //       if (checkBranchExisting) {
        //         checkBranchExisting.name = branchDto.name;
        //       } else {
        //         const newUserBranch = new UserBranch();
        //         newUserBranch.id = +branchDto.id;
        //         newUserBranch.name = branchDto.name;
        //         user.branches.push(newUserBranch);
        //       }
        //     } else {
        //       const newUserBranch = new UserBranch();
        //       newUserBranch.id = +branchDto.id;
        //       newUserBranch.name = branchDto.name;
        //       user.branches = [newUserBranch];
        //     }
        //   }
        //   console.log(user.branches);
        // }
        //
        // if (userDto.salesRepresentative) {
        //   if (user.salesRepresentative) {
        //     if (user.salesRepresentative.id === +userDto.salesRepresentative.id) {
        //       user.salesRepresentative.name = userDto.salesRepresentative.name;
        //       user.salesRepresentative.email = userDto.salesRepresentative.email;
        //       user.salesRepresentative.phone = userDto.salesRepresentative.phone;
        //     } else {
        //       const salesRepresentative = await queryRunner.manager.getRepository(SalesRepresentative).findOne(userDto.salesRepresentative.id);
        //       if (salesRepresentative) {
        //         salesRepresentative.name = userDto.salesRepresentative.name;
        //         salesRepresentative.email = userDto.salesRepresentative.email;
        //         salesRepresentative.phone = userDto.salesRepresentative.phone;
        //       } else {
        //         const salesRepresentative = new SalesRepresentative();
        //         salesRepresentative.id = +userDto.salesRepresentative.id;
        //         salesRepresentative.name = userDto.salesRepresentative.name;
        //         salesRepresentative.email = userDto.salesRepresentative.email;
        //         salesRepresentative.phone = userDto.salesRepresentative.phone;
        //         user.salesRepresentative = salesRepresentative;
        //       }
        //     }
        //   } else {
        //     const salesRepresentative = await queryRunner.manager.getRepository(SalesRepresentative).findOne(userDto.salesRepresentative.id);
        //     if (salesRepresentative) {
        //       salesRepresentative.name = userDto.salesRepresentative.name;
        //       salesRepresentative.email = userDto.salesRepresentative.email;
        //       salesRepresentative.phone = userDto.salesRepresentative.phone;
        //       user.salesRepresentative = salesRepresentative;
        //     } else {
        //       const salesRepresentative = new SalesRepresentative();
        //       salesRepresentative.id = +userDto.salesRepresentative.id;
        //       salesRepresentative.name = userDto.salesRepresentative.name;
        //       salesRepresentative.email = userDto.salesRepresentative.email;
        //       salesRepresentative.phone = userDto.salesRepresentative.phone;
        //       user.salesRepresentative = salesRepresentative;
        //     }
        //   }
        // }
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
