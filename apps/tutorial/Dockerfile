FROM node:alpine As development
WORKDIR /usr/src/app
RUN apk add --no-cache openssl
COPY prisma ./prisma/
RUN npx prisma generate --schema=./prisma/schema.prisma
COPY package*.json ./
RUN yarn install
RUN yarn add bcrypt


COPY . .
RUN npm run build
FROM node:alpine as production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=production
COPY . .
COPY --from=development /usr/src/app/dist ./dist
CMD ["node", "dist/apps/tutorial/main"]