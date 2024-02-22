import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  async SignUp(authDto: AuthDto) {
    const { email, password } = authDto;
    const user = await this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });
    if (user !== null) {
      throw new BadRequestException('User already exists');
    } else {
      const salts = 10;
      const hash = await bcrypt.hash(password, salts);
      const obj = {
        email: email,
        password: hash,
      };
      await this.prismaService.user.create({
        data: obj,
      });
      return obj;
    }
  }

  async SignIn(authDto: AuthDto) {
    const { email, password } = authDto;
    const userExist = await this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });
    if (userExist) {
      const isMatch = await bcrypt.compare(password, userExist.password);
      if (isMatch) {
        const payload = { id: userExist.id, email: userExist.email };
        return {
          access_token: await this.jwtService.signAsync(payload),
        };
      } else {
        throw new UnauthorizedException('Invalid credentials');
      }
    } else {
      throw new BadRequestException('Create account first');
    }
  }
}
