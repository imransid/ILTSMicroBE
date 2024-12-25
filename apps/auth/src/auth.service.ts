import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service'; // Assuming you're using Prisma
import { JwtService } from '@nestjs/jwt';
import { RegisterInput } from './dto/register.input';
import { LoginResponse, RegisterResponse } from './types/auth.types';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Register a new user in the system.
   * @param registerInput Input data for registration
   * @param res The response object to send cookies
   * @returns A response with a success message and JWT token
   */
  async register(
    registerInput: RegisterInput,
    res: any,
  ): Promise<RegisterResponse> {
    const { email, password, firstName, lastName, mobileNumber, role } =
      registerInput;

    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new BadRequestException('Email is already registered.');
      }

      // Hash the password using bcrypt
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the new user in the database
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

      // Return the response
      return {
        message: user.firstName + '' + 'registered successfully.',
      };
    } catch (error) {
      console.error('Error during registration:', error);
      throw new InternalServerErrorException('Registration failed.');
    }
  }

  /**
   * Login an existing user with email and password.
   * @param email The user's email
   * @param password The user's password
   * @returns A response with a success message and JWT token
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    // Check if approval status is false
    if (!user.approveStatus) {
      throw new UnauthorizedException('Approval is pending.');
    }

    // Generate JWT token with the secret from JwtService configuration
    const token = this.jwtService.sign(
      { id: user.id, email: user.email, role: user.role },
      { expiresIn: '1h' },
    );

    return {
      message: 'Login successful.',
      token,
    };
  }

  /**
   * Update user profile information.
   * @param userId The user's unique identifier
   * @param updateProfileInput The profile fields to be updated
   * @returns The updated user record
   */
  async updateProfile(userId: number, updateProfileInput: any): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    // Update the user profile data
    return this.prisma.user.update({
      where: { id: userId },
      data: updateProfileInput,
    });
  }

  /**
   * Fetch all users from the system.
   * @returns A list of users
   */
  async getUsers(): Promise<any[]> {
    return this.prisma.user.findMany();
  }
}
