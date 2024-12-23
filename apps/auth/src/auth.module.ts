import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { GraphQLModule } from '@nestjs/graphql';
import { PrismaService } from '../../../prisma/prisma.service'; //  prisma/prisma.service";
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthResolver } from './auth.resolvers';

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
  providers: [ConfigService, JwtService, PrismaService, AuthResolver],
})
export class AuthModule {}
