import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import {
  BadRequestException,
  UseGuards,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
import { UpdateProfileInput } from './dto/update-profile.input';
import { LoginResponse, RegisterResponse } from './types/auth.types';
import { User } from './entities/user.entity';

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => RegisterResponse)
  async register(
    @Args('registerInput') registerInput: RegisterInput,
    @Context() context: { res: any },
  ): Promise<RegisterResponse> {
    try {
      if (
        !registerInput.email ||
        !registerInput.password ||
        !registerInput.firstName ||
        !registerInput.lastName ||
        !registerInput.mobileNumber ||
        !registerInput.role
      ) {
        throw new BadRequestException('All fields are required.');
      }
      return await this.authService.register(registerInput, context.res);
    } catch (error) {
      console.error('Register error:', error);
      throw new InternalServerErrorException('Registration failed.');
    }
  }

  @Mutation(() => LoginResponse)
  async login(
    @Args('loginInput') loginInput: LoginInput,
  ): Promise<LoginResponse> {
    try {
      return await this.authService.login(
        loginInput.email,
        loginInput.password,
      );
    } catch (error) {
      console.error('Login error:', error);
      throw new InternalServerErrorException('Login failed.');
    }
  }

  @Mutation(() => User)
  @UseGuards(AuthGuard)
  async updateProfile(
    @Args('updateProfileInput') updateProfileInput: UpdateProfileInput,
    @Context() context: { req: any },
  ): Promise<User> {
    try {
      const userId = context.req.user.id;
      return await this.authService.updateProfile(userId, updateProfileInput);
    } catch (error) {
      console.error('Update profile error:', error);
      throw new InternalServerErrorException('Profile update failed.');
    }
  }

  @Query(() => [User])
  @UseGuards(AuthGuard)
  async getUsers(@Context() context: { req: any }): Promise<User[]> {
    try {
      return await this.authService.getUsers(context.req);
    } catch (error) {
      console.error('Get users error:', error);
      throw new InternalServerErrorException('Failed to fetch users.');
    }
  }
}
