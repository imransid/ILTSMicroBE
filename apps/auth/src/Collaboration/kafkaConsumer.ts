import { Kafka } from 'kafkajs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // Load the environment variables

const kafka = new Kafka({
  clientId: 'auth-service',
  brokers: ['localhost:9093'],
});

const consumer = kafka.consumer({ groupId: 'auth-group' });

async function validateTokenFromTutorial() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'auth-validation', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const token = message.value?.toString();
      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET as string); // Use the secret from the .env file
          console.log('Token is valid:', decoded);
        } catch (error) {
          console.error('Invalid token:', error);
        }
      }
    },
  });
}

validateTokenFromTutorial();
