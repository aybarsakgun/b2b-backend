import { Body, Controller, Post } from "@nestjs/common";
import { Public } from "../common/decorators";
import { UserRepository } from "./user.repository";
import { UserRole } from "./user.model";

@Controller("user")
@Public()
export class UserController {
  constructor(private readonly userRepository: UserRepository) {}

  @Post("transfer")
  async userTransfer(@Body() body) {
    console.log(body);
    const userPromises = body.map(async (user, i) => {
      const result = await this.userRepository.save({
        name: user.name,
        username: user.username,
        password: user.password,
        email: user.email,
        role: user.roles === "ROLE_USER" ? UserRole.USER : UserRole.ADMIN,
        isActive: user.isActive === 1,
        currency: user.currency,
        customerId: user.customerId,
        priceOrder: user.priceOrder,
        branch: user.branch,
      });
      return result;
    });

    return await Promise.all(userPromises);
  }
}
