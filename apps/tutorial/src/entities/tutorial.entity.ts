import { ObjectType, Field, Int } from '@nestjs/graphql';
import { pathFinderMiddleware } from '../middleware/pathfinder';

@ObjectType()
export class Tutorial {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field()
  image: string;

  // @Field({
  //   description: 'Featured file',
  //   middleware: [pathFinderMiddleware],
  //   nullable: true,
  // })
  // images: string; // or any other type if needed

  @Field()
  videoUrl: string;

  @Field()
  source: string;

  @Field()
  mediaType: string;

  @Field()
  filename: string;

  @Field()
  category: string;

  @Field()
  description: string;

  @Field(() => Int)
  like: number;

  @Field(() => Int)
  dislike: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
