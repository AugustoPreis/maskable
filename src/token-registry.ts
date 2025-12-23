/**
 * Mask Token Registry
 *
 * Defines all available tokens for use in mask patterns.
 * This separation allows extensibility and facilitates the addition of new tokens.
 */
import { TokenRegistry } from './types';

/**
 * Default tokens available for string masks
 */
export const defaultTokenRegistry: TokenRegistry = {
  // Required digit (0-9), default value '0'
  '0': {
    pattern: /\d/,
    defaultValue: '0',
  },

  // Optional digit (0-9)
  '9': {
    pattern: /\d/,
    optional: true,
  },

  // Optional and recursive digit (0-9) - can repeat indefinitely
  '#': {
    pattern: /\d/,
    optional: true,
    recursive: true,
  },

  // Required alphanumeric (a-z, A-Z, 0-9)
  A: {
    pattern: /[a-zA-Z0-9]/,
  },

  // Required letter (a-z, A-Z)
  S: {
    pattern: /[a-zA-Z]/,
  },

  // Required letter converted to uppercase
  U: {
    pattern: /[a-zA-Z]/,
    transform: (character: string) => character.toLocaleUpperCase(),
  },

  // Required letter converted to lowercase
  L: {
    pattern: /[a-zA-Z]/,
    transform: (character: string) => character.toLocaleLowerCase(),
  },

  // Escape character - treats next character as literal
  $: {
    escape: true,
  },
};

/**
 * Factory function to create a custom token registry
 * Allows extension of the default token set
 */
export function createTokenRegistry(
  customTokens?: Partial<TokenRegistry>,
): TokenRegistry {
  const tokenRegistry = { ...defaultTokenRegistry };

  if (customTokens) {
    Object.assign(tokenRegistry, customTokens);
  }

  return tokenRegistry;
}
