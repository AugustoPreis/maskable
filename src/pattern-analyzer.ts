/**
 * Mask Pattern Analyzer
 *
 * Responsible for analyzing and processing information about mask patterns.
 */
import { TokenRegistry, MaskToken } from './types';

export class PatternAnalyzer {
  public constructor(private readonly tokenRegistry: TokenRegistry) {}

  /**
   * Checks if a character at a specific position is escaped
   *
   * A character is considered escaped if preceded by an odd number
   * of consecutive escape characters.
   */
  public isCharacterEscaped(pattern: string, position: number): boolean {
    let currentPosition = position - 1;
    let escapeCount = 0;

    while (currentPosition >= 0) {
      const currentChar = pattern.charAt(currentPosition);
      const token = this.getToken(currentChar);

      if (!token?.escape) {
        break;
      }

      escapeCount++;
      currentPosition--;
    }

    return escapeCount > 0 && escapeCount % 2 === 1;
  }

  /**
   * Calculates how many optional numbers should be used
   *
   * Compares the quantity of required digits in the pattern with
   * the quantity of available digits in the value.
   */
  public calculateOptionalNumbersToUse(pattern: string, value: string): number {
    const requiredDigitsInPattern = this.countRequiredDigits(pattern);
    const availableDigitsInValue = this.countDigits(value);

    return Math.max(0, availableDigitsInValue - requiredDigitsInPattern);
  }

  /**
   * Checks if there are more non-escape tokens in the specified direction
   */
  public hasMoreTokens(
    pattern: string,
    position: number,
    increment: number,
  ): boolean {
    const character = pattern.charAt(position);

    if (character === '') {
      return false;
    }

    const token = this.getToken(character);

    if (token && !token.escape) {
      return true;
    }

    return this.hasMoreTokens(pattern, position + increment, increment);
  }

  /**
   * Checks if there are more recursive tokens in the specified direction
   */
  public hasMoreRecursiveTokens(
    pattern: string,
    position: number,
    increment: number,
  ): boolean {
    const character = pattern.charAt(position);

    if (character === '') {
      return false;
    }

    const token = this.getToken(character);

    if (token?.recursive) {
      return true;
    }

    return this.hasMoreRecursiveTokens(
      pattern,
      position + increment,
      increment,
    );
  }

  /**
   * Gets the token associated with a character
   */
  public getToken(character: string): MaskToken | undefined {
    return this.tokenRegistry[character];
  }

  /**
   * Counts only required digits (token '0') in the pattern
   */
  private countRequiredDigits(pattern: string): number {
    return (pattern.match(/0/g) || []).length;
  }

  /**
   * Counts all numeric digits in a string
   */
  private countDigits(value: string): number {
    return (value.match(/\d/g) || []).length;
  }
}
