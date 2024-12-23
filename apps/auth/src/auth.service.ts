import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service'; // Assuming you're using Prisma
import { JwtService } from '@nestjs/jwt';
import { RegisterInput } from './dto/register.input';
import { LoginResponse, RegisterResponse } from './types/auth.types';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    registerInput: RegisterInput,
    res: any,
  ): Promise<RegisterResponse> {
    const { email, password, firstName, lastName, mobileNumber, role } =
      registerInput;

    // Check for existing user
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException('Email already registered.');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        mobileNumber,
        role,
      },
    });

    // Generate JWT token
    const token = this.jwtService.sign({ id: user.id });

    // Set the token in a cookie
    res.cookie('authToken', token, { httpOnly: true });

    return {
      message: 'User registered successfully.',
      token,
    };
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const token = this.jwtService.sign({ id: user.id });

    return {
      message: 'Login successful.',
      token,
    };
  }

  async updateProfile(userId: number, updateProfileInput: any): Promise<any> {
    return this.prisma.user.update({
      where: { id: userId },
      data: updateProfileInput,
    });
  }

  async getUsers(): Promise<any> {
    return this.prisma.user.findMany();
  }
}
