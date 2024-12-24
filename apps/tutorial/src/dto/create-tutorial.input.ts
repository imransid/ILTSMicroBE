import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsInt, IsOptional, IsUrl } from 'class-validator';

@InputType()
export class CreateTutorialInput {
  @Field()
  @IsString()
  title: string;

  @Field()
  @IsString()
  image: string;

  @Field()
  @IsUrl()
  videoUrl: string;

  @Field()
  @IsString()
  description: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsInt()
  like?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsInt()
  dislike?: number;
}
