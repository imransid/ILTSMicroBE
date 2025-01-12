import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateTutorialInput } from './dto/create-tutorial.input';
import { UpdateTutorialInput } from './dto/update-tutorial.input';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

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
    let videoUrl = '';
    let filename = '';
    if (createTutorialInput.mediaType === 'drive') {
      videoUrl = this.convertToDownloadUrl(createTutorialInput.videoUrl);
    }

    if (
      createTutorialInput.mediaType === 'video' ||
      createTutorialInput.mediaType === 'audio' ||
      createTutorialInput.mediaType === 'image'
    ) {
      filename;

      const images = Array.isArray(createTutorialInput.images)
        ? createTutorialInput.images
        : [createTutorialInput.images];

      // Process each image (you can process each individually if needed)
      const filePaths = await Promise.all(
        images.map((file: any) => this.processUpload(file)),
      );
      filename = filePaths[0];
    }

    const { images, ...tutorialData } = createTutorialInput;

    return this.prisma.tutorial.create({
      data: {
        ...tutorialData,
        filename: filename,
        videoUrl: videoUrl,
        like: createTutorialInput.like ?? 0, // Set like to 0 if not provided
        dislike: createTutorialInput.dislike ?? 0, // Set dislike to 0 if not provided
        category: createTutorialInput.category, // Include category explicitly
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

  async processUpload(file: any): Promise<string> {
    // If file is a promise, resolve it
    const resolvedFile = await file;

    // Validate if the file object is properly structured
    if (
      !resolvedFile ||
      !resolvedFile.createReadStream ||
      !resolvedFile.filename
    ) {
      throw new Error('File upload is invalid or missing required fields.');
    }

    // Destructure the file object
    const { createReadStream, filename, mimetype } = resolvedFile;
    const uploadDir = path.join(__dirname, './', 'uploads'); // Ensure this path is correct

    // Create the directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    // Define the full path where the file will be saved
    const filePath = path.join(uploadDir, filename);

    // Create a writable stream to save the file
    const writeStream = fs.createWriteStream(filePath);

    // Handle the stream piping and wait for it to complete
    const stream = createReadStream();
    stream.pipe(writeStream); // Pipe the read stream directly into the write stream

    // Use a promise to wait until the write stream finishes
    await new Promise((resolve, reject) => {
      writeStream.on('finish', resolve); // Resolve when the writing is done
      writeStream.on('error', reject); // Reject if an error occurs during writing
    });

    return filename; // Return the file path where it was saved
  }
}
