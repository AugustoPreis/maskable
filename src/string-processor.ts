/**
 * String Processor
 *
 * Responsible for string manipulation operations.
 */
import { MaskToken, MaskOptions } from './types';

export class StringProcessor {
  /**
   * Concatenates a character to the text, applying transformations if necessary
   */
  public concatenateCharacter(
    text: string,
    character: string,
    options: MaskOptions,
    token?: MaskToken,
  ): string {
    let processedCharacter = character;

    // Apply transformation if token has a transform function
    if (token?.transform) {
      processedCharacter = token.transform(character);
    }

    // Concatenate in correct order based on direction
    return options.reverse
      ? processedCharacter + text
      : text + processedCharacter;
  }

  /**
   * Inserts a character at a specific position in the string
   */
  public insertCharacterAt(
    text: string,
    character: string,
    position: number,
  ): string {
    const chars = text.split('');
    chars.splice(position, 0, character);

    return chars.join('');
  }

  /**
   * Normalizes a value to string, ensuring correct type
   */
  public normalizeToString(value: unknown): string | undefined {
    if (value === null || value === undefined) {
      return undefined;
    }

    return String(value);
  }
}
