import { StringProcessor } from '../src/string-processor';
import { MaskToken, MaskOptions } from '../src/types';

describe('StringProcessor', () => {
  let processor: StringProcessor;

  beforeEach(() => {
    processor = new StringProcessor();
  });

  describe('concatenateCharacter', () => {
    it('should concatenate character in forward direction', () => {
      const options: MaskOptions = { reverse: false };
      const result = processor.concatenateCharacter('hello', ' ', options);

      expect(result).toBe('hello ');
    });

    it('should concatenate character in reverse direction', () => {
      const options: MaskOptions = { reverse: true };
      const result = processor.concatenateCharacter('world', '!', options);

      expect(result).toBe('!world');
    });

    it('should apply transformation when token has transform function', () => {
      const options: MaskOptions = { reverse: false };
      const token: MaskToken = {
        transform: (char: string) => char.toUpperCase(),
      };

      const result = processor.concatenateCharacter(
        'hello',
        'a',
        options,
        token,
      );

      expect(result).toBe('helloA');
    });

    it('should apply transformation in reverse direction', () => {
      const options: MaskOptions = { reverse: true };
      const token: MaskToken = {
        transform: (char: string) => char.toLowerCase(),
      };

      const result = processor.concatenateCharacter(
        'world',
        'X',
        options,
        token,
      );

      expect(result).toBe('xworld');
    });

    it('should not transform when token has no transform function', () => {
      const options: MaskOptions = { reverse: false };
      const token: MaskToken = { pattern: /\d/ };

      const result = processor.concatenateCharacter(
        'test',
        '5',
        options,
        token,
      );

      expect(result).toBe('test5');
    });

    it('should concatenate to empty string', () => {
      const options: MaskOptions = { reverse: false };
      const result = processor.concatenateCharacter('', 'a', options);

      expect(result).toBe('a');
    });
  });

  describe('insertCharacterAt', () => {
    it('should insert character at the beginning', () => {
      const result = processor.insertCharacterAt('hello', 'X', 0);

      expect(result).toBe('Xhello');
    });

    it('should insert character in the middle', () => {
      const result = processor.insertCharacterAt('hello', '-', 2);

      expect(result).toBe('he-llo');
    });

    it('should insert character at the end', () => {
      const result = processor.insertCharacterAt('hello', '!', 5);

      expect(result).toBe('hello!');
    });

    it('should insert character in empty string', () => {
      const result = processor.insertCharacterAt('', 'a', 0);

      expect(result).toBe('a');
    });

    it('should handle multiple insertions', () => {
      let result = processor.insertCharacterAt('hello', '1', 0);
      result = processor.insertCharacterAt(result, '2', 3);
      result = processor.insertCharacterAt(result, '3', 6);

      expect(result).toBe('1he2ll3o');
    });
  });

  describe('normalizeToString', () => {
    it('should return undefined for null', () => {
      const result = processor.normalizeToString(null);

      expect(result).toBeUndefined();
    });

    it('should return undefined for undefined', () => {
      const result = processor.normalizeToString(undefined);

      expect(result).toBeUndefined();
    });

    it('should convert number to string', () => {
      const result = processor.normalizeToString(123);

      expect(result).toBe('123');
    });

    it('should convert boolean to string', () => {
      expect(processor.normalizeToString(true)).toBe('true');
      expect(processor.normalizeToString(false)).toBe('false');
    });

    it('should keep string as string', () => {
      const result = processor.normalizeToString('hello');

      expect(result).toBe('hello');
    });

    it('should convert object to string', () => {
      const result = processor.normalizeToString({ test: 'value' });

      expect(result).toBe('[object Object]');
    });

    it('should convert array to string', () => {
      const result = processor.normalizeToString([1, 2, 3]);

      expect(result).toBe('1,2,3');
    });

    it('should handle empty string', () => {
      const result = processor.normalizeToString('');

      expect(result).toBe('');
    });

    it('should handle zero', () => {
      const result = processor.normalizeToString(0);

      expect(result).toBe('0');
    });
  });
});
