import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { TutorialService } from './tutorial.service';
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
import { ClientKafka } from '@nestjs/microservices';

@Resolver(() => Tutorial)
export class TutorialResolver implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly tutorialService: TutorialService,
    @Inject('any_client_id_i_want') private readonly client: ClientKafka,
  ) {}

  async onModuleInit() {
    ['auth-validation'].forEach((key) =>
      this.client.subscribeToResponseOf(`${key}`),
    );
    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.close();
  }

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
      // Send token to Kafka for validation
      const isValidToken = await this.client
        .send('auth-validation', {
          token: authHeader,
          timestamp: new Date().toISOString(),
        })
        .toPromise();

      // Check if token is valid
      if (!isValidToken) {
        throw new UnauthorizedException('Invalid or expired token.');
      }

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

    console.log('Authorization Header:', authHeader);

    try {
      // Send the token to Kafka for validation
      const validToken = await this.client
        .send('auth-validation', {
          token: authHeader,
          timestamp: new Date().toISOString(),
        })
        .toPromise();

      if (!validToken) {
        throw new UnauthorizedException('Invalid or expired token');
      }

      console.log('Token validated successfully:', validToken);
    } catch (error) {
      console.error('Error during token validation or Kafka message:', error);
      throw new InternalServerErrorException(
        'An error occurred while validating the token or communicating with Kafka.',
      );
    }

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
