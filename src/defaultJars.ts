import { Topic } from "./api";
import { TopicHolder } from "./models/TopicHolder";

export const getDefaultTopics = (): Topic[] =>
  [
    { name: "Words of Affirmation" },
    { name: "Acts of Service" },
    { name: "Receiving Gifts" },
    { name: "Quality Time" },
    { name: "Physical Touch" },
  ].map((topic) => {
    return new TopicHolder().setName(topic.name);
  });
