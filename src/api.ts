export interface ExportApi {
  metadata: {
    semVer: `${number}.${number}.${number}`;
    schemaVersion: number;
    isoExportedAt: string;
  };
  topics: Topic[];
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
  /** maxlength = 20 chars */
  producer: string;
  reaction: EmotionalReaction;
  /** 0-100 */
  strength: number;
}

export interface Tag {
  /** 1-20 chars long **/
  name: string;
}

export type Emotions = [Emotion, ...Emotion[]];
export type Tags = [Tag, ...Tag[]];
export const emotionalReactions = {
  positive: "positive",
  neutral: "neutral",
  negative: "negative",
} as const;

export type EmotionalReaction = keyof typeof emotionalReactions;
