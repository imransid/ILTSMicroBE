import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AuthController } from './auth.controller';
import { PrismaService } from '../../../prisma/prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Ensure this import is here
import { JwtModule } from '@nestjs/jwt';
import { AuthResolver } from './auth.resolvers';
import { AuthService } from './auth.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    // Ensure ConfigModule is imported here
    ConfigModule.forRoot(), // Load environment variables from .env file

    // GraphQL setup
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      introspection: true,
      playground: true,
    }),

    // JWT configuration using JwtModule.registerAsync
    JwtModule.registerAsync({
      imports: [ConfigModule], // Import ConfigModule to access ConfigService
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Fetch secret from environment variables
        signOptions: {
          expiresIn: '5h', // Set token expiration (optional)
        },
      }),
      inject: [ConfigService], // Inject ConfigService into the factory function
    }),


    
  ],
  controllers: [AuthController],
  providers: [PrismaService, AuthResolver, AuthService],
})
export class AuthModule {}
