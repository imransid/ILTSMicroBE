import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class LoginResponse {
  @Field()
  message: string;

  @Field()
  token: string;
}

@ObjectType()
export class RegisterResponse {
  @Field()
  message: string;

  @Field()
  token: string;
}
