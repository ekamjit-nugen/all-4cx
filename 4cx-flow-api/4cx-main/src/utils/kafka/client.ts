const { Kafka } = require("kafkajs");
import EnvManager from "../../core/EnvManager";

export const kafka = new Kafka({
  // clientId: EnvManager.getKafkaClientId(),
  // brokers: EnvManager.getKafkaBrokers()
  // clientId: "my-app",
  // brokers: ["0.0.0.0:9092"],
  clientId: 'my-app',
  brokers: ['kafka:29092'], // Use the service name from Docker Compose
});