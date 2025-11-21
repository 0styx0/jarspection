export const colors = {
  yes: "#44ff44",
  maybe: "#ffdd44",
  no: "#ff4444",
} as const;

// export type HexColorValue = (typeof colors)[keyof typeof colors];

export interface ExportApi {
  metadata: {
    semVer: `${number}.${number}.${number}`;
    schemaVersion: number;
    isoExportedAt: string;
  };
  topic: Topic[];
}

export interface Topic {
  metadata: {
    id: string;
    tags: Tags;
  };
  name: string;
  emotions: Emotions;
}

export interface Emotion {
  metadata: {
    authorName: string;
    isoCreatedAt: string;
    isoUpdatedAt: string;
  };
  /** what produces the emotion? eg "Giving", "Bob" */
  producer: string;
  reaction: EmotionalReaction;
  /** 0-100 */
  strength: number;
}

export interface Tag {
  name: string;
}

export type Emotions = [Emotion, ...Emotion[]];
export type Tags = [Tag, ...Tag[]];
export const emotionalReactions = {
  positive: "positive",
  neutral: "neutral",
  negative: "negative",
} as const;

type EmotionalReaction = keyof typeof emotionalReactions;
