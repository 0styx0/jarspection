import {
  Emotion,
  EmotionalReaction,
  Emotions,
  Tag,
  Tags,
  Topic,
  emotionalReactions,
} from "../api";

let topicCounter = 0;

export class TopicHolder implements Topic {
  metadata = {
    id: `new-topic-${topicCounter++}`,
    tags: [new TagHolder()] as Tags,
  };
  name = "New Topic";
  emotions: Emotions = [new EmotionHolder("G"), new EmotionHolder("R")];

  constructor() {
    return this;
  }
  setId(id: string) {
    this.metadata.id = id;
    return this;
  }
  setName(name: string) {
    this.name = name;
    return this;
  }
  setEmotions(emotions: Emotions) {
    this.emotions = emotions;
    return this;
  }
}

class EmotionHolder implements Emotion {
  metadata = {
    authorName: "Unknown",
    isoCreatedAt: new Date().toISOString(),
    isoUpdatedAt: new Date().toISOString(),
  };
  producer = "G";
  reaction = emotionalReactions.neutral;
  strength = 50;

  constructor(producer: string) {
    this.producer = producer;
  }
}

class TagHolder implements Tag {
  name = "default";
}

export const reactionToHex: Record<EmotionalReaction, string> = {
  positive: "#44ff44",
  neutral: "#ffdd44",
  negative: "#ff4444",
};
