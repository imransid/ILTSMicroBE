import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MercuriusDriver, MercuriusDriverConfig } from '@nestjs/mercurius';
import { TutorialController } from './tutorial.controller';
import { TutorialService } from './tutorial.service';
import { PrismaService } from '../../../prisma/prisma.service';

@Module({
  imports: [
    GraphQLModule.forRoot<MercuriusDriverConfig>({
      driver: MercuriusDriver,
      graphiql: true,
    }),
  ],
  controllers: [TutorialController],
  providers: [TutorialService, PrismaService],
})
export class TutorialModule {}
