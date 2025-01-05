# FROM node:alpine As development
# WORKDIR /usr/src/app
# RUN apk add --no-cache openssl
# COPY prisma ./prisma/
# RUN npx prisma generate --schema=./prisma/schema.prisma
# COPY package*.json ./
# RUN yarn cache clean && yarn install
# #RUN yarn add @grpc/grpc-js @nestjs/microservices
# # RUN yarn add bcrypt
# #RUN npm rebuild bcrypt 



# COPY . .
# RUN npm run build
# FROM node:alpine as production
# ARG NODE_ENV=production
# ENV NODE_ENV=${NODE_ENV}
# WORKDIR /usr/src/app
# COPY package*.json ./
# RUN npm install --only=production
# COPY . .
# COPY --from=development /usr/src/app/dist ./dist

# CMD ["node", "dist/apps/tutorial/main"]



FROM node:20 As development

WORKDIR /usr/src/app

COPY package*.json yarn.lock./

RUN yarn

COPY prisma ./prisma/

COPY . .

RUN npx prisma generate

RUN yarn build

#CMD ["yarn",  "start:dev"]

#RUN yarn add @grpc/grpc-js @nestjs/microservices
# RUN yarn add bcrypt
# RUN npm rebuild bcrypt 

FROM node:alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/tutorial/main"]

