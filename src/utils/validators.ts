// ============================================================================
// Validation Result Types
// ============================================================================

import { emotionalReactions, ExportApi, Topic, Emotion, Tag } from "../api";

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: ValidationError[] };

export interface ValidationError {
  path: string;
  message: string;
}

// ============================================================================
// Constraint Definitions
// ============================================================================

export const exportConstraints = {
  semVer: {
    type: "string" as const,
    pattern: /^\d+\.\d+\.\d+$/,
    patternDescription: "number.number.number",
  },
  isoDate: {
    type: "string" as const,
    pattern: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/,
    patternDescription: "ISO 8601 format (YYYY-MM-DDTHH:mm:ss)",
    customValidation: (value: string) => !isNaN(new Date(value).getTime()),
  },
  tag: {
    name: {
      type: "string" as const,
      minLength: 1,
      maxLength: 20,
    },
  },
  emotion: {
    producer: {
      type: "string" as const,
      minLength: 1,
      maxLength: 20,
    },
    reaction: {
      type: "enum" as const,
      allowedValues: [...Object.keys(emotionalReactions)] as const,
    },
    strength: {
      type: "number" as const,
      min: 0,
      max: 100,
      integer: true,
    },
    metadata: {
      authorName: {
        type: "string" as const,
        minLength: 1,
      },
      isoCreatedAt: "isoDate" as const,
      isoUpdatedAt: "isoDate" as const,
    },
  },
  topic: {
    name: {
      type: "string" as const,
      minLength: 1,
    },
    metadata: {
      id: {
        type: "string" as const,
        minLength: 1,
      },
      tags: {
        type: "array" as const,
        nonempty: true,
      },
    },
    emotions: {
      type: "array" as const,
      nonempty: true,
    },
  },
  exportApi: {
    metadata: {
      semVer: "semVer" as const,
      schemaVersion: {
        type: "number" as const,
        min: 0,
        integer: true,
      },
      isoExportedAt: "isoDate" as const,
    },
    topics: {
      type: "array" as const,
      nonempty: false,
    },
  },
} as const;

// ============================================================================
// Generic Validators
// ============================================================================

function validateString(
  value: unknown,
  path: string,
  constraint: { type: "string"; minLength?: number; maxLength?: number },
): ValidationError[] {
  if (typeof value !== "string") {
    return [{ path, message: "Must be a string" }];
  }
  if (
    constraint.minLength !== undefined &&
    value.length < constraint.minLength
  ) {
    return [
      { path, message: `Must be at least ${constraint.minLength} characters` },
    ];
  }
  if (
    constraint.maxLength !== undefined &&
    value.length > constraint.maxLength
  ) {
    return [
      { path, message: `Must be at most ${constraint.maxLength} characters` },
    ];
  }
  return [];
}

function validateNumber(
  value: unknown,
  path: string,
  constraint: { type: "number"; min?: number; max?: number; integer?: boolean },
): ValidationError[] {
  if (typeof value !== "number") {
    return [{ path, message: "Must be a number" }];
  }
  if (isNaN(value) || !isFinite(value)) {
    return [{ path, message: "Must be a valid number" }];
  }
  if (constraint.integer && !Number.isInteger(value)) {
    return [{ path, message: "Must be an integer" }];
  }
  if (constraint.min !== undefined && value < constraint.min) {
    return [{ path, message: `Must be at least ${constraint.min}` }];
  }
  if (constraint.max !== undefined && value > constraint.max) {
    return [{ path, message: `Must be at most ${constraint.max}` }];
  }
  return [];
}

function validateEnum<T extends string>(
  value: unknown,
  path: string,
  constraint: { type: "enum"; allowedValues: readonly T[] },
): ValidationError[] {
  if (typeof value !== "string") {
    return [{ path, message: "Must be a string" }];
  }
  if (!constraint.allowedValues.includes(value as T)) {
    return [
      {
        path,
        message: `Must be one of: ${constraint.allowedValues.join(", ")}`,
      },
    ];
  }
  return [];
}

function validatePattern(
  value: unknown,
  path: string,
  constraint: {
    type: "string";
    pattern: RegExp;
    patternDescription: string;
    customValidation?: (value: string) => boolean;
  },
): ValidationError[] {
  if (typeof value !== "string") {
    return [{ path, message: "Must be a string" }];
  }
  if (!constraint.pattern.test(value)) {
    return [
      { path, message: `Must match format: ${constraint.patternDescription}` },
    ];
  }
  if (constraint.customValidation && !constraint.customValidation(value)) {
    return [{ path, message: `Invalid ${constraint.patternDescription}` }];
  }
  return [];
}

function validateArray<T>(
  value: unknown,
  path: string,
  itemValidator: (item: unknown, itemPath: string) => ValidationError[],
  constraint: { type: "array"; nonempty?: boolean },
): ValidationError[] {
  if (!Array.isArray(value)) {
    return [{ path, message: "Must be an array" }];
  }
  if (constraint.nonempty && value.length === 0) {
    return [{ path, message: "Must contain at least one item" }];
  }

  const errors: ValidationError[] = [];
  value.forEach((item, index) => {
    errors.push(...itemValidator(item, `${path}[${index}]`));
  });
  return errors;
}

function validateObject(value: unknown, path: string): ValidationError[] {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return [{ path, message: "Must be an object" }];
  }
  return [];
}

// ============================================================================
// Constraint Resolution
// ============================================================================

function resolveConstraint(constraint: any): any {
  // Handle string references like 'isoDate' or 'semVer'
  if (typeof constraint === "string") {
    return exportConstraints[constraint as keyof typeof exportConstraints];
  }
  return constraint;
}

// ============================================================================
// Composite Validators (Using Constraints)
// ============================================================================

function validateSemVer(value: unknown, path: string): ValidationError[] {
  const constraint = exportConstraints.semVer;
  return validatePattern(value, path, constraint);
}

function validateISODate(value: unknown, path: string): ValidationError[] {
  const constraint = exportConstraints.isoDate;
  return validatePattern(value, path, constraint);
}

function validateTag(value: unknown, path: string): ValidationError[] {
  const errors = validateObject(value, path);
  if (errors.length > 0) return errors;

  const obj = value as Record<string, unknown>;
  const constraint = exportConstraints.tag;

  errors.push(...validateString(obj.name, `${path}.name`, constraint.name));

  return errors;
}

function validateTags(value: unknown, path: string): ValidationError[] {
  const constraint = exportConstraints.topic.metadata.tags;
  return validateArray(value, path, validateTag, constraint);
}

function validateEmotionMetadata(
  value: unknown,
  path: string,
): ValidationError[] {
  const errors = validateObject(value, path);
  if (errors.length > 0) return errors;

  const obj = value as Record<string, unknown>;
  const constraint = exportConstraints.emotion.metadata;

  errors.push(
    ...validateString(
      obj.authorName,
      `${path}.authorName`,
      constraint.authorName,
    ),
  );
  errors.push(...validateISODate(obj.isoCreatedAt, `${path}.isoCreatedAt`));
  errors.push(...validateISODate(obj.isoUpdatedAt, `${path}.isoUpdatedAt`));

  return errors;
}

function validateEmotion(value: unknown, path: string): ValidationError[] {
  const errors = validateObject(value, path);
  if (errors.length > 0) return errors;

  const obj = value as Record<string, unknown>;
  const constraint = exportConstraints.emotion;

  errors.push(...validateEmotionMetadata(obj.metadata, `${path}.metadata`));
  errors.push(
    ...validateString(obj.producer, `${path}.producer`, constraint.producer),
  );
  errors.push(
    ...validateEnum(obj.reaction, `${path}.reaction`, constraint.reaction),
  );
  errors.push(
    ...validateNumber(obj.strength, `${path}.strength`, constraint.strength),
  );

  return errors;
}

function validateEmotions(value: unknown, path: string): ValidationError[] {
  const constraint = exportConstraints.topic.emotions;
  return validateArray(value, path, validateEmotion, constraint);
}

function validateTopicMetadata(
  value: unknown,
  path: string,
): ValidationError[] {
  const errors = validateObject(value, path);
  if (errors.length > 0) return errors;

  const obj = value as Record<string, unknown>;
  const constraint = exportConstraints.topic.metadata;

  errors.push(...validateString(obj.id, `${path}.id`, constraint.id));
  errors.push(...validateTags(obj.tags, `${path}.tags`));

  return errors;
}

function validateTopic(value: unknown, path: string): ValidationError[] {
  const errors = validateObject(value, path);
  if (errors.length > 0) return errors;

  const obj = value as Record<string, unknown>;
  const constraint = exportConstraints.topic;

  errors.push(...validateTopicMetadata(obj.metadata, `${path}.metadata`));
  errors.push(...validateString(obj.name, `${path}.name`, constraint.name));
  errors.push(...validateEmotions(obj.emotions, `${path}.emotions`));

  return errors;
}

function validateTopics(value: unknown, path: string): ValidationError[] {
  const constraint = exportConstraints.exportApi.topics;
  return validateArray(value, path, validateTopic, constraint);
}

function validateExportMetadata(
  value: unknown,
  path: string,
): ValidationError[] {
  const errors = validateObject(value, path);
  if (errors.length > 0) return errors;

  const obj = value as Record<string, unknown>;
  const constraint = exportConstraints.exportApi.metadata;

  errors.push(...validateSemVer(obj.semVer, `${path}.semVer`));
  errors.push(
    ...validateNumber(
      obj.schemaVersion,
      `${path}.schemaVersion`,
      constraint.schemaVersion,
    ),
  );
  errors.push(...validateISODate(obj.isoExportedAt, `${path}.isoExportedAt`));

  return errors;
}

function validateExportApi(
  value: unknown,
  path: string = "root",
): ValidationError[] {
  const errors = validateObject(value, path);
  if (errors.length > 0) return errors;

  const obj = value as Record<string, unknown>;

  errors.push(...validateExportMetadata(obj.metadata, `${path}.metadata`));
  errors.push(...validateTopics(obj.topics, `${path}.topics`));

  return errors;
}

// ============================================================================
// Public API
// ============================================================================

export function parseAndValidate(
  jsonString: string,
): ValidationResult<ExportApi> {
  try {
    const parsed = JSON.parse(jsonString);
    const errors = validateExportApi(parsed);

    if (errors.length > 0) {
      return { success: false, errors };
    }

    return { success: true, data: parsed as ExportApi };
  } catch (error) {
    return {
      success: false,
      errors: [
        {
          path: "root",
          message: `JSON parse error: ${error instanceof Error ? error.message : "Unknown error"}`,
        },
      ],
    };
  }
}

export function exportFileValidator(
  data: unknown,
): ValidationResult<ExportApi> {
  const errors = validateExportApi(data);

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return { success: true, data: data as ExportApi };
}

export function parseJson(containerText: string): ValidationResult<object> {
  try {
    return { success: true, data: JSON.parse(containerText) };
  } catch (e) {
    console.error("Import error parsing json", containerText);
    return {
      success: false,
      errors: [
        {
          path: "root",
          message: "Unable to parse json",
        },
      ],
    };
  }
}

// Individual component validators for granular validation
export const validators = {
  tag: (data: unknown): ValidationResult<Tag> => {
    const errors = validateTag(data, "tag");
    return errors.length === 0
      ? { success: true, data: data as Tag }
      : { success: false, errors };
  },
  emotion: (data: unknown): ValidationResult<Emotion> => {
    const errors = validateEmotion(data, "emotion");
    return errors.length === 0
      ? { success: true, data: data as Emotion }
      : { success: false, errors };
  },
  topic: (data: unknown): ValidationResult<Topic> => {
    const errors = validateTopic(data, "topic");
    return errors.length === 0
      ? { success: true, data: data as Topic }
      : { success: false, errors };
  },
};

// ============================================================================
// Usage Examples
// ============================================================================

/*
// View constraints
console.log(exportConstraints.emotion.strength); // { type: 'number', min: 0, max: 100, integer: true }

// Modify constraints (if needed)
// exportConstraints.emotion.strength.max = 200;

// Parse and validate
const result = parseAndValidate('{"metadata": {...}, "topics": [...]}');
if (result.success) {
  console.log('Valid:', result.data); // data is now typed as ExportApi
} else {
  console.error('Errors:', result.errors);
}

// Validate individual components
const topicResult = validators.topic({...});
if (topicResult.success) {
  console.log('Valid topic:', topicResult.data); // data is now typed as Topic
}
*/
