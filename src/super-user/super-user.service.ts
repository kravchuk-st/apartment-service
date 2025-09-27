import { Injectable, OnModuleInit } from '@nestjs/common';
import { ROLE } from 'src/model/role.model';
import { UserService } from 'src/user/user.service';

@Injectable()
export class SuperUserService implements OnModuleInit {
  constructor(private userService: UserService) {}

  async onModuleInit() {
    const existingSuperUser =
      await this.userService.findOneByEmail('admin@gmail.com');

    if (!existingSuperUser) {
      console.log('Создаю суперпользователя...');

      const superUser = {
        email: 'admin@gmail.com',
        password: 'test',
        firstName: 'Stanislav',
        lastName: 'Kravchuk',
        role: ROLE.ADMIN,
        phone: '',
        myLanguages: [],
        myCountries: [],
      };
      await this.userService.create(superUser);
      console.log('Суперпользователь создан.');
    } else {
      console.log('Суперпользователь уже существует.');
    }
  }
}
