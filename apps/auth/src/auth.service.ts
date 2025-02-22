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
import { GrpcMethod } from '@nestjs/microservices';
import { User } from '@prisma/client';

interface MessageRequest {
  message: string;
}

interface MessageResponse {
  status: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  @GrpcMethod('AuthService', 'ValidateToken')
  validateToken(data: { token: string }): { isValid: boolean; userId: string } {
    const isValid = data.token === 'valid-token'; // Example token validation logic
    return { isValid, userId: isValid ? 'user123' : '' };
  }

  @GrpcMethod('MessageService', 'SendMessage')
  sendMessage(data: MessageRequest): MessageResponse {
    console.log('Message received:', data.message);
    return { status: 'Message sent successfully' };
  }

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
    const {
      email,
      password,
      firstName,
      lastName,
      mobileNumber,
      role,
      deviceID,
    } = registerInput;

    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });

      const existingDevice = await this.prisma.user.findUnique({
        where: { deviceID },
      });

      if (existingUser) {
        throw new BadRequestException('Email is already registered.');
      }

      if (existingDevice) {
        throw new BadRequestException('Device is already registered.');
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
          deviceID,
        },
      });

      // Return the response
      return {
        message: user.firstName + ' ' + 'registered successfully.',
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
  async login(
    email: string,
    password: string,
    deviceID: string,
  ): Promise<LoginResponse> {
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
      throw new UnauthorizedException(
        'Your account approval is still pending. Please wait for approval.',
      );
    }

    if (user.deviceID !== deviceID) {
      throw new UnauthorizedException(
        'The current device is not authorized for this account.',
      );
    }

    // Generate JWT token with the secret from JwtService configuration
    const token = this.jwtService.sign(
      { id: user.id, email: user.email, role: user.role },
      { expiresIn: '5h' },
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

  async deleteUser(id: number) {
    try {
      const result = await this.prisma.tutorial.delete({
        where: { id },
      });

      if (result) {
        return 'Tutorial deleted successfully';
      } else {
        return 'Tutorial deletion failed';
      }
    } catch (error) {
      console.error('Error during tutorial deletion:', error);
      throw new InternalServerErrorException('Failed to delete tutorial.');
    }
  }

  async getAUser(userId: number): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    return user;
  }

  async updateApprovalStatus(id: number, approveStatus: boolean): Promise<any> {
    // Find and update the user by their ID using Prisma
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        approveStatus, // Update the approveStatus field
        updatedAt: new Date(), // Optionally, update the timestamp
      },
    });

    return updatedUser; // Return the updated user
  }
}
