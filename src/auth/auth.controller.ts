import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/create-auth.dto';
import { AuthGuard } from './auth.guard';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  SignUp(@Body() authDto: AuthDto) {
    return this.authService.SignUp(authDto);
  }
  @Post('signin')
  SignIn(@Body() authDto: AuthDto) {
    return this.authService.SignIn(authDto);
  }

  @UseGuards(AuthGuard)
  @Get('test')
  Test() {
    return 'Testing';
  }
}
