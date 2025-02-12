import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsInt, IsOptional } from 'class-validator';
import { Upload } from '../scalars/upload.scalar';

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

  @Field(() => Upload, {
    nullable: true,
    description: 'Input for the profile image files.',
  })
  @IsOptional() // Make the image field optional
  images?: Upload; // Make the images field nullable and optional

  @Field()
  @IsString()
  @IsOptional()
  source: string;

  @Field()
  @IsString()
  @IsOptional()
  mediaType: string; //drive

  @Field()
  @IsString()
  @IsOptional()
  filename: string;
}
