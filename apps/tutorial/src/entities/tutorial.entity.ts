import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Tutorial {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field()
  image: string;

  @Field()
  videoUrl: string;

  @Field()
  description: string;

  @Field()
  date: Date;

  @Field(() => Int)
  like: number;

  @Field(() => Int)
  dislike: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
