// import { Module } from '@nestjs/common';
// import { GraphQLModule } from '@nestjs/graphql';
// import { MercuriusDriver, MercuriusDriverConfig } from '@nestjs/mercurius';
// import { TutorialController } from './tutorial.controller';
// import { TutorialService } from './tutorial.service';
// import { PrismaService } from '../../../prisma/prisma.service';
// import { TutorialResolver } from './tutorial.resolver';

// @Module({
//   imports: [
//     GraphQLModule.forRoot<MercuriusDriverConfig>({
//       driver: MercuriusDriver,
//       graphiql: true,
//       autoSchemaFile: true,
//     }),
//   ],
//   controllers: [TutorialController],
//   providers: [TutorialService, PrismaService, TutorialResolver],
// })
// export class TutorialModule {}

import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PrismaService } from '../../../prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { TutorialController } from './tutorial.controller';
import { TutorialService } from './tutorial.service';
import { TutorialResolver } from './tutorial.resolver';
import { ClientsModule, Transport } from '@nestjs/microservices';

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

    // Kafka client setup
    ClientsModule.register([
      {
        name: 'any_client_id_i_want',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'any_client_id_i_want',
            brokers: ['kafka:9092'], //['localhost:29092'],
          },
          consumer: {
            groupId: 'an_unique_string_id',
          },
        },
      },
    ]),
  ],
  controllers: [TutorialController],
  providers: [PrismaService, TutorialResolver, TutorialService],
})
export class TutorialModule {}
