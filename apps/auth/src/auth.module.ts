// import { Module } from '@nestjs/common';
// import { AuthController } from './auth.controller';
// import { AuthService } from './auth.service';

// @Module({
//   imports: [],
//   controllers: [AuthController],
//   providers: [AuthService],
// })
// export class AuthModule {}

import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UsersService } from './users.service';
import { GraphQLModule } from '@nestjs/graphql';
import { PrismaService } from '../../../prisma/prisma.service'; //  prisma/prisma.service";
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthResolver } from './auth.resolvers';
import { join } from 'path';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    UsersService,
    ConfigService,
    JwtService,
    PrismaService,
    AuthResolver,
  ],
})
export class UsersModule {}
