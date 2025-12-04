export type OpResult<T> =
  | { success: true; data: T }
  | { success: false; errors: OpError[] };

export interface OpError {
  path: string;
  message: string;
}
