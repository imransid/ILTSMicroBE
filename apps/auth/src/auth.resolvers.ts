import { Resolver, Mutation, Args, Query, Context, Int } from '@nestjs/graphql';
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

  @Query(() => String)
  async hello(): Promise<string> {
    return 'Hello World!';
  }

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

  // New query to get a users
  @Query(() => [User])
  @UseGuards(AuthGuard)
  async getAllUsers(@Context() context: { req: any }): Promise<User[]> {
    try {
      const userId = context.req.user.id;
      return await this.authService.getUsers();
    } catch (error) {
      console.error('Get all users error:', error);
      throw new InternalServerErrorException('Failed to fetch users.');
    }
  }

  @Query(() => User)
  @UseGuards(AuthGuard)
  async getAUser(@Context() context: { req: any }): Promise<User> {
    try {
      const userId = context.req.user.id;
      let user = await this.authService.getAUser(userId);

      return user;
    } catch (error) {
      console.error('Get all users error:', error);
      throw new InternalServerErrorException('Failed to fetch users.');
    }
  }

  // Mutation to delete a user by ID
  @Mutation(() => String)
  @UseGuards(AuthGuard)
  async deleteUser(
    @Args('id', { type: () => Int }) id: number,
    @Context() context: { req: any },
  ): Promise<string> {
    try {
      const result = await this.authService.deleteUser(id);
      return result ? 'delete successfully' : 'delete failed'; // Assuming the service returns `true` if successful
    } catch (error) {
      console.error('Delete user error:', error);
      throw new InternalServerErrorException('Failed to delete user.');
    }
  }

  @Mutation(() => User)
  @UseGuards(AuthGuard)
  async updateUserApprovalStatus(
    @Args('id', { type: () => Int }) id: number, // User ID to update
    @Args('approveStatus', { type: () => Boolean }) approveStatus: boolean, // New approval status
    @Context() context: { req: any }, // Context to extract the logged-in user
  ): Promise<User> {
    try {
      // Ensure the authenticated user has the necessary permissions
      // const userId = context.req.user.id;
      // const role = context.req.user.role;

      // if (role !== 'admin') {
      //   throw new BadRequestException(
      //     'You are not authorized to update approval status.',
      //   );
      // }

      // Call the service to update the user's approval status
      return await this.authService.updateApprovalStatus(id, approveStatus);
    } catch (error) {
      console.error('Update approval status error:', error);
      throw new InternalServerErrorException(
        'Failed to update approval status.',
      );
    }
  }
}
