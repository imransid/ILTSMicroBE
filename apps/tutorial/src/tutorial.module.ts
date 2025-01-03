import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PrismaService } from '../../../prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { TutorialController } from './tutorial.controller';
import { TutorialService } from './tutorial.service';
import { TokenValidationService } from './TokenValidationService.service';
import { TutorialResolver } from './tutorial.resolver';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { v4 as uuidv4 } from 'uuid';
import { join } from 'path';
@Module({
  imports: [
    // Load environment variables from .env file
    ConfigModule.forRoot(),

    // GraphQL setup
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      introspection: true,
      playground: true,
    }),

    ClientsModule.register([
      {
        name: 'USERPROTO_PACKAGE',
        transport: Transport.GRPC,
        options: {
          url: 'auth_service:50052',
          package: 'userproto',
          protoPath: join(__dirname, '../../../proto/message.proto'),
        },
      },
    ]),
  ],
  controllers: [TutorialController],
  providers: [
    PrismaService,
    TutorialResolver,
    TutorialService,
    TokenValidationService,
  ],
})
export class TutorialModule {}
