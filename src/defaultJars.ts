import { Topic } from "./api";
import { TopicHolder } from "./models/TopicHolder";

export const defaultTopics: Topic[] = [
  { name: "Words of Affirmation" },
  { name: "Acts of Service" },
  { name: "Receiving Gifts" },
  { name: "Quality Time" },
  { name: "Physical Touch" },
].map((topic) => new TopicHolder().setName(topic.name));
