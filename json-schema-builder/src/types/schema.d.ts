export type FieldType = 'string' | 'number' | 'nested';

export interface SchemaField {
  id: string; // Unique ID for React keys and easier manipulation
  name: string; // The key in the JSON object
  type: FieldType;
  value?: string | number; // Default value for string/number, not used for nested
  children?: SchemaField[]; // For 'nested' type
}

export interface Schema {
  [key: string]: string | number | Schema;
}