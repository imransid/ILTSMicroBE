import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateProfileInput {
  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  mobileNumber?: string;

  @Field({ nullable: true })
  role?: string;
}
