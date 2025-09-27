import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { AuthTokenType, JWTPayload } from './models/auth.model';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/schemas/user.schema';
import { ROLE } from 'src/model/role.model';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async getProfile(id: string) {
    return this.usersService.findOneById(id);
  }

  async signIn(email: string, password: string): Promise<AuthTokenType> {
    const user = await this.usersService.validateUser(email, password);
    if (!user) throw new UnauthorizedException();
    return this.getTokens(user);
  }

  async signUp(
    createUserDto: CreateUserDto,
  ): Promise<{ tokens: AuthTokenType; user: User }> {
    if (createUserDto.role === ROLE.ADMIN) {
      throw new BadRequestException('Admin role can create by Admins');
    }

    try {
      const newUser = await this.usersService.create(createUserDto);
      const tokens = await this.getTokens(newUser);
      return { tokens, user: newUser };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async refreshTokens({ role, userId }: JWTPayload) {
    const user = await this.usersService.findOneById(userId);
    if (!user) throw new ForbiddenException('Access Denied');

    try {
      const token = await this.getToken(
        {
          role: role,
          userId: userId,
        },
        {
          secret: this.configService.get('JWT_ACCESS'),
          expiresIn: this.configService.get('JWT_ACCESS_EXPIRE'),
        },
      );
      return {
        accessToken: token,
      };
    } catch (error) {
      console.log(error);

      throw new ForbiddenException('Access Denied');
    }
  }

  private async getTokens(user: User): Promise<AuthTokenType> {
    const payload = {
      userId: user.id,
      role: user.role,
    };
    try {
      const [accessToken, refreshToken] = await Promise.all([
        this.getToken(payload, {
          secret: this.configService.get<string>('JWT_ACCESS'),
          expiresIn: this.configService.get('JWT_ACCESS_EXPIRE'),
        }),
        this.getToken(payload, {
          secret: this.configService.get<string>('JWT_REFRESH'),
          expiresIn: this.configService.get('JWT_REFRESH_EXPIRE'),
        }),
      ]);

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw new ForbiddenException(error?.message);
    }
  }

  private async getToken(
    payload: JWTPayload,
    option: { secret: string; expiresIn?: string },
  ) {
    return this.jwtService.signAsync(payload, option);
  }

  async validateUser(email: string, pass: string): Promise<User> | null {
    return await this.usersService.validateUser(email, pass);
  }
}
