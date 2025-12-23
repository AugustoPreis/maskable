/**
 * Types and Interfaces for String Masking System
 */

/**
 * Interface that defines the behavior of a mask token
 */
export interface MaskToken {
  /** Regex pattern that the input character must satisfy */
  pattern?: RegExp;

  /** Indicates if this token is optional (can be omitted) */
  optional?: boolean;

  /** Indicates if this token is recursive (can repeat indefinitely) */
  recursive?: boolean;

  /** Default value to be used when the input value is empty */
  defaultValue?: string;

  /** Indicates if this token is an escape character */
  escape?: boolean;

  /** Transformation function to be applied to the character (e.g., uppercase, lowercase) */
  transform?: (character: string) => string;
}

/**
 * Configuration options for mask processing
 */
export interface MaskOptions {
  /** If true, processes the string from right to left */
  reverse?: boolean;

  /** If true, uses default token values when input ends */
  useDefaults?: boolean;
}

/**
 * Result of mask processing
 */
export interface MaskResult {
  /** Formatted string with applied mask */
  result: string;

  /** Indicates if the input value is valid according to the pattern */
  valid: boolean;
}

/**
 * Enum for processing direction
 */
export enum ProcessingDirection {
  FORWARD = 1,
  REVERSE = -1,
}

/**
 * Iteration configuration based on direction
 */
export interface IterationConfig {
  /** Initial position of iteration */
  start: number;

  /** Final position of iteration */
  end: number;

  /** Increment/decrement per iteration */
  increment: ProcessingDirection;
}

/**
 * Mapping of special characters to mask tokens
 */
export type TokenRegistry = Record<string, MaskToken>;
