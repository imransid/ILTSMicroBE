import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsInt, IsOptional } from 'class-validator';
import { CreateTutorialInput } from './create-tutorial.input';

@InputType()
export class UpdateTutorialInput extends PartialType(CreateTutorialInput) {
  @Field()
  @IsInt()
  id: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsInt() // Ensures this field only accepts integers
  like?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsInt() // Ensures this field only accepts integers
  dislike?: number;
}
