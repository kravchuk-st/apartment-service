import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ConfigService } from '@nestjs/config';
import { HashingHelper } from 'src/helper/hash.helper';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { JWTPayload } from 'src/auth/models/auth.model';
import { ROLE } from 'src/model/role.model';
@Injectable()
export class UserService {
  constructor(
    private configService: ConfigService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.userModel
        .findOne({ email: createUserDto.email })
        .exec();
      if (user) throw new ForbiddenException('email already existing');
      const newUser = new this.userModel(createUserDto);

      newUser.password = await HashingHelper.hash(
        newUser.password,
        +this.configService.get('SALT'),
      );
      const result = await newUser.save();
      return result;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  findAll(payload: JWTPayload) {
    try {
      if (payload.role === ROLE.ADMIN) {
        return this.userModel.find().select(['-__v', '-password']).exec();
      }
      return this.userModel.find().select(['-__v', '-password']).exec();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async validateUser(email: string, pass: string): Promise<User> | null {
    try {
      const user = await this.findOneByEmail(email);
      if (!user) throw new NotFoundException('User not found');
      const isMatch = await HashingHelper.isMatch(pass, user.password);
      if (user && isMatch) {
        return user;
      }
      return null;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOneByEmail(email: string) {
    try {
      return await this.userModel.findOne({ email }).exec();
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }

  async findOneById(id: string) {
    try {
      const user = await this.userModel
        .findById(id)
        .select(['-__v', '-password'])
        .exec();
      if (!user) throw new NotFoundException('User not found');
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, { password, ...updateUserDto }: UpdateUserDto) {
    try {
      const updatedUser = await this.userModel
        .findByIdAndUpdate(id, updateUserDto, { new: true })
        .select(['-__v', '-password'])
        .exec();
      if (!updatedUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    try {
      const result = await this.userModel.findByIdAndDelete(id).exec();
      if (!result) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return true;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
