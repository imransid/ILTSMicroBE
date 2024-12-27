import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsInt, IsOptional } from 'class-validator';

@InputType()
export class CreateTutorialInput {
  @Field()
  @IsString()
  title: string;

  @Field()
  @IsString()
  image: string;

  @Field()
  @IsString()
  videoUrl: string;

  @Field()
  @IsString()
  category: string;

  @Field()
  @IsString()
  description: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsInt() // Use @IsInt for integer values
  like?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsInt() // Use @IsInt for integer values
  dislike?: number;
}
