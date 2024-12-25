import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'tutorial-service',
  brokers: ['localhost:9093'],
});

const producer = kafka.producer();

async function sendTokenToAuthService(token: string) {
  await producer.connect();
  await producer.send({
    topic: 'auth-validation',
    messages: [
      {
        value: token,
      },
    ],
  });
  await producer.disconnect();
}

export { sendTokenToAuthService };
