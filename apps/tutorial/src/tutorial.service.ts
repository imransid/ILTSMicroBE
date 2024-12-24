import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateTutorialInput } from './dto/create-tutorial.input';
import { UpdateTutorialInput } from './dto/update-tutorial.input';

@Injectable()
export class TutorialService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTutorialInput: CreateTutorialInput) {
    return this.prisma.tutorial.create({
      data: {
        ...createTutorialInput,
        like: createTutorialInput.like ?? 0, // Set like to 0 if not provided
        dislike: createTutorialInput.dislike ?? 0, // Set dislike to 0 if not provided
      },
    });
  }

  async findAll() {
    return this.prisma.tutorial.findMany();
  }

  async findOne(id: number) {
    return this.prisma.tutorial.findUnique({
      where: { id },
    });
  }

  async update(updateTutorialInput: UpdateTutorialInput) {
    const { id, ...data } = updateTutorialInput;
    return this.prisma.tutorial.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.tutorial.delete({
      where: { id },
    });
  }
}
