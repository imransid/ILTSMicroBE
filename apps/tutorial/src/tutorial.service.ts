import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateTutorialInput } from './dto/create-tutorial.input';
import { UpdateTutorialInput } from './dto/update-tutorial.input';

@Injectable()
export class TutorialService {
  constructor(private readonly prisma: PrismaService) {}

  convertToDownloadUrl(driveUrl) {
    // Extract the file ID from the given Google Drive URL
    const match = driveUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      const fileId = match[1];
      // Construct the direct download link
      return `https://drive.google.com/uc?export=download&id=${fileId}`;
    } else {
      throw new Error('Invalid Google Drive URL');
    }
  }

  async create(createTutorialInput: CreateTutorialInput) {
    let videoUrl = this.convertToDownloadUrl(createTutorialInput.videoUrl);

    return this.prisma.tutorial.create({
      data: {
        ...createTutorialInput,
        videoUrl: videoUrl,
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

    // Create a dynamic object for the fields to update
    const updateData: any = {};

    // Conditionally add fields to updateData if they exist
    if (data.title) updateData.title = data.title;
    if (data.image) updateData.image = data.image;
    if (data.videoUrl) updateData.videoUrl = data.videoUrl;
    if (data.description) updateData.description = data.description;
    if (data.like !== undefined) updateData.like = data.like;
    if (data.dislike !== undefined) updateData.dislike = data.dislike;

    // Update the tutorial with the constructed updateData object
    return this.prisma.tutorial.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: number) {
    return this.prisma.tutorial.delete({
      where: { id },
    });
  }
}
