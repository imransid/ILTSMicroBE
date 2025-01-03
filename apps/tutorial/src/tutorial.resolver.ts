import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { TutorialService } from './tutorial.service';
import { TokenValidationService } from './TokenValidationService.service';
import { Tutorial } from './entities/tutorial.entity';
import { CreateTutorialInput } from './dto/create-tutorial.input';
import { UpdateTutorialInput } from './dto/update-tutorial.input';
import {
  BadRequestException,
  Inject,
  InternalServerErrorException,
  OnModuleDestroy,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientGrpc, ClientKafka } from '@nestjs/microservices';
import { Observable } from 'rxjs';

interface UserService {
  getUsers({}): Observable<any>;
}

@Resolver(() => Tutorial)
export class TutorialResolver {
  // export class TutorialResolver {
  private userService: UserService;
  constructor(
    private readonly tutorialService: TutorialService,
    private readonly tokenValidationService: TokenValidationService,
  ) {}

  @Mutation(() => Tutorial)
  async createTutorial(
    @Args('createTutorialInput') createTutorialInput: CreateTutorialInput,
    @Context() context,
  ): Promise<Tutorial> {
    const authHeader = context?.req?.headers['authorization'];

    if (!authHeader) {
      throw new BadRequestException('Authorization header is missing.');
    }

    try {
      await this.tokenValidationService.validateToken(authHeader);

      // Proceed with creating the tutorial
      return await this.tutorialService.create(createTutorialInput);
    } catch (error) {
      console.error(
        'Error during token validation or tutorial creation:',
        error,
      );

      // Handle specific known errors
      if (error instanceof UnauthorizedException) {
        throw error; // Rethrow unauthorized error
      }

      // Generic internal server error
      throw new InternalServerErrorException(
        'An error occurred while creating the tutorial.',
      );
    }
  }

  @Query(() => [Tutorial], { name: 'getAllTutorials' })
  async findAll(@Context() context) {
    const authHeader = context?.req?.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Authorization token is missing');
    }

    await this.tokenValidationService.validateToken(authHeader);

    // Proceed to retrieve tutorials if the token is valid
    try {
      return await this.tutorialService.findAll();
    } catch (error) {
      console.error('Error fetching tutorials:', error);
      throw new InternalServerErrorException('Failed to fetch tutorials.');
    }
  }

  @Query(() => Tutorial, { name: 'getTutorial' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.tutorialService.findOne(id);
  }

  @Mutation(() => Tutorial)
  async updateTutorial(
    @Args('updateTutorialInput') updateTutorialInput: UpdateTutorialInput,
  ) {
    try {
      const updatedTutorial =
        await this.tutorialService.update(updateTutorialInput);

      if (!updatedTutorial) {
        throw new InternalServerErrorException('Failed to update tutorial.');
      }

      return updatedTutorial;
    } catch (error) {
      console.error('Error updating tutorial:', error);
      throw new InternalServerErrorException(
        'An error occurred while updating the tutorial.',
      );
    }
  }

  @Mutation(() => Tutorial)
  async removeTutorial(@Args('id', { type: () => Int }) id: number) {
    try {
      const removedTutorial = await this.tutorialService.remove(id);

      if (!removedTutorial) {
        throw new InternalServerErrorException(
          'Tutorial not found or could not be removed.',
        );
      }

      return removedTutorial;
    } catch (error) {
      console.error('Error removing tutorial:', error);
      throw new InternalServerErrorException(
        'An error occurred while removing the tutorial.',
      );
    }
  }
}
