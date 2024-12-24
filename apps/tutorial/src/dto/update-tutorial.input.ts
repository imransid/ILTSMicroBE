import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateTutorialInput } from './create-tutorial.input';

@InputType()
export class UpdateTutorialInput extends PartialType(CreateTutorialInput) {
  @Field()
  id: number;
}
