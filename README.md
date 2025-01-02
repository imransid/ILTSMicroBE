# Microservices Architecture with NestJS, Kafka, Prisma, and GraphQL

This project demonstrates a microservices architecture built with **NestJS** and integrates **Kafka**, **Prisma**, **GraphQL**, and **Apollo Gateway**. It includes two primary services: `authService` and `tutorialService`.

## Project Structure

my-microservices-app/ │ ├── apps/ │ ├── authService/ │ │ ├── src/ │ │ │ ├── app.controller.ts │ │ │ ├── app.module.ts │ │ │ ├── auth/ │ │ │ │ ├── auth.controller.ts │ │ │ │ ├── auth.service.ts │ │ │ │ └── auth.module.ts │ │ │ └── main.ts │ │ ├── package.json │ │ └── tsconfig.json │ │ │ └── tutorialService/ │ ├── src/ │ │ ├── app.controller.ts │ │ ├── app.module.ts │ │ ├── tutorial/ │ │ │ ├── tutorial.controller.ts │ │ │ ├── tutorial.service.ts │ │ │ └── tutorial.module.ts │ │ └── main.ts │ ├── package.json │ └── tsconfig.json │ ├── middleware/ │ ├── logging.middleware.ts │ └── auth.middleware.ts │ ├── prisma/ │ ├── schema.prisma │ ├── migrations/ │ └── prisma.service.ts │ ├── nest-cli.json ├── docker-compose.yml ├── package.json └── tsconfig.json

# First Step is

> nest new .

> nest generate app auth
> nest generate app tutorial

## root directory

> @nestjs/microservices prisma @prisma/client

> yarn add @apollo/gateway @apollo/server @apollo/subgraph @nestjs/apollo @nestjs/common @nestjs/config @nestjs/core @nestjs/graphql @nestjs/jwt @nestjs/platform-express @nestjs/serve-static @prisma/client @types/bcrypt bcrypt class-validator express graphql-upload multer

### DB PUSH

> docker exec ae24cf98d184 npx prisma generate

> docker exec ae24cf98d184 npx prisma migrate deploy

### migrate

> docker exec ae24cf98d184 npx prisma db push --force-reset

## UI for apeche kafka

> If will detach from the terminal (it will run in the background) and will “magically” start the Kafka for you. To see if its working, you can just open the http://localhost:8080/ and will expect the following:

## REF

> > https://plainenglish.io/blog/a-beginners-introduction-to-kafka-with-typescript-using-nestjs-7c92fe78f638

> > curl --location --request GET 'http://localhost:4001/kafka-test-with-response'

> > create topic >> auth-validation

docker exec fbc1273d1fda npx prisma db push --force-reset

<!-- Add SWAP MEMORY -->

sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
