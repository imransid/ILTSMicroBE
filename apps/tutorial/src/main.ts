import { NestFactory } from '@nestjs/core';
import { TutorialModule } from './tutorial.module';
//import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs';
import { graphqlUploadExpress } from 'graphql-upload';

async function bootstrap() {
  const app = await NestFactory.create(TutorialModule);
  // app.use(graphqlUploadExpress({ maxFileSize: 100000000, maxFiles: 15 }));

  app.use(graphqlUploadExpress());

  app.enableCors({
    origin: true,
    credentials: true,
  });
  await app.listen(4001);
}
bootstrap();
