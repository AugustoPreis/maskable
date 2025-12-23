/**
 * StringMasker - Main Class
 *
 * Provides a clean and modern API for applying masks to strings.
 * Supports customizable masks, reverse processing, and special tokens.
 */
import { MaskOptions, MaskResult, TokenRegistry } from './types';
import { defaultTokenRegistry } from './token-registry';
import { MaskProcessor } from './mask-processor';

export class StringMasker {
  private readonly pattern: string;
  private readonly options: Required<MaskOptions>;
  private readonly tokenRegistry: TokenRegistry;

  public constructor(
    pattern: string,
    options?: MaskOptions,
    customTokenRegistry?: TokenRegistry,
  ) {
    this.pattern = pattern;
    this.tokenRegistry = customTokenRegistry || defaultTokenRegistry;
    this.options = {
      reverse: options?.reverse ?? false,
      useDefaults: options?.useDefaults ?? options?.reverse ?? false,
    };
  }

  /**
   * Processes a value applying the mask
   * Returns both the formatted result and validity flag
   * ```
   */
  public process(value: unknown): MaskResult {
    const stringValue = this.normalizeValue(value);

    const processor = new MaskProcessor(
      this.pattern,
      this.options,
      this.tokenRegistry,
    );

    return processor.process(stringValue);
  }

  /**
   * Applies the mask and returns only the formatted result
   */
  public apply(value: unknown): string {
    return this.process(value).result;
  }

  /**
   * Validates if a value conforms to the mask pattern
   */
  public validate(value: unknown): boolean {
    return this.process(value).valid;
  }

  /**
   * Normalizes the input value to string
   */
  private normalizeValue(value: unknown): string {
    if (value === null || value === undefined) {
      return '';
    }

    return String(value);
  }

  /**
   * Processes a value with a mask statically
   * Useful for one-time use without creating an instance
   */
  public static process(
    value: unknown,
    pattern: string,
    options?: MaskOptions,
  ): MaskResult {
    const masker = new StringMasker(pattern, options);
    return masker.process(value);
  }

  /**
   * Applies a mask statically
   */
  public static apply(
    value: unknown,
    pattern: string,
    options?: MaskOptions,
  ): string {
    const masker = new StringMasker(pattern, options);
    return masker.apply(value);
  }

  /**
   * Validates a value against a pattern statically
   */
  public static validate(
    value: unknown,
    pattern: string,
    options?: MaskOptions,
  ): boolean {
    const masker = new StringMasker(pattern, options);
    return masker.validate(value);
  }
}
