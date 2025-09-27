import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/decorators/user.decorator';
import { SignInDto } from './dto/create-login.dto';
import { LocalAuthGuard } from 'src/auth/guard/local_passport.guard';
import { AuthJWTGuard } from 'src/auth/guard/auth.guard';
import { RefreshTokenGuard } from './guard/refresh-token.guard';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { JWTPayload } from './models/auth.model';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  login(@Body(new ValidationPipe()) signInDto: SignInDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Post('signup')
  signup(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@User() user: JWTPayload) {
    return this.authService.refreshTokens(user);
  }

  @UseGuards(AuthJWTGuard)
  @Get('profile')
  getProfile(@User() user: JWTPayload) {
    return this.authService.getProfile(user.userId);
  }
}
