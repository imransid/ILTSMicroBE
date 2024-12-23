my-microservices-app/ │ ├── apps/ │ ├── authService/ │ │ ├── src/ │ │ │ ├── app.controller.ts │ │ │ ├── app.module.ts │ │ │ ├── auth/ │ │ │ │ ├── auth.controller.ts │ │ │ │ ├── auth.service.ts │ │ │ │ └── auth.module.ts │ │ │ └── main.ts │ │ ├── package.json │ │ └── tsconfig.json │ │ │ └── tutorialService/ │ ├── src/ │ │ ├── app.controller.ts │ │ ├── app.module.ts │ │ ├── tutorial/ │ │ │ ├── tutorial.controller.ts │ │ │ ├── tutorial.service.ts │ │ │ └── tutorial.module.ts │ │ └── main.ts │ ├── package.json │ └── tsconfig.json │ ├── middleware/ │ ├── logging.middleware.ts │ └── auth.middleware.ts │ ├── prisma/ │ ├── schema.prisma │ ├── migrations/ │ └── prisma.service.ts │ ├── nest-cli.json ├── docker-compose.yml ├── package.json └── tsconfig.json

# First Step is

> nest new .

> nest generate app auth
> nest generate app tutorial

## root directory

> @nestjs/microservices prisma @prisma/client

> yarn add @apollo/gateway @apollo/server @apollo/subgraph @nestjs/apollo @nestjs/common @nestjs/config @nestjs/core @nestjs/graphql @nestjs/jwt @nestjs/platform-express @nestjs/serve-static @prisma/client @types/bcrypt bcrypt class-validator express graphql-upload multer

