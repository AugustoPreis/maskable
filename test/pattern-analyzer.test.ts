import { PatternAnalyzer } from '../src/pattern-analyzer';
import { TokenRegistry } from '../src/types';

describe('PatternAnalyzer', () => {
  let analyzer: PatternAnalyzer;
  let tokenRegistry: TokenRegistry;

  beforeEach(() => {
    tokenRegistry = {
      '0': { pattern: /\d/, defaultValue: '0' },
      '9': { pattern: /\d/, optional: true },
      '#': { pattern: /\d/, optional: true, recursive: true },
      A: { pattern: /[a-zA-Z0-9]/ },
      S: { pattern: /[a-zA-Z]/ },
      $: { escape: true },
    };
    analyzer = new PatternAnalyzer(tokenRegistry);
  });

  describe('isCharacterEscaped', () => {
    it('should return false when no escape character', () => {
      const result = analyzer.isCharacterEscaped('000-0000', 3);

      expect(result).toBe(false);
    });

    it('should return true when preceded by one escape character', () => {
      const result = analyzer.isCharacterEscaped('00$0-0000', 3);

      expect(result).toBe(true);
    });

    it('should return false when preceded by two escape characters', () => {
      const result = analyzer.isCharacterEscaped('0$$0-0000', 3);

      expect(result).toBe(false);
    });

    it('should return true when preceded by three escape characters', () => {
      const result = analyzer.isCharacterEscaped('$$$0-0000', 3);

      expect(result).toBe(true);
    });

    it('should return false at the beginning of pattern', () => {
      const result = analyzer.isCharacterEscaped('0000', 0);

      expect(result).toBe(false);
    });

    it('should handle escape character not in registry', () => {
      const customRegistry: TokenRegistry = {
        '0': { pattern: /\d/ },
      };
      const customAnalyzer = new PatternAnalyzer(customRegistry);

      const result = customAnalyzer.isCharacterEscaped('\\0', 1);

      expect(result).toBe(false);
    });
  });

  describe('calculateOptionalNumbersToUse', () => {
    it('should return 0 when value has exact required digits', () => {
      const result = analyzer.calculateOptionalNumbersToUse(
        '000-0000',
        '1234567',
      );

      expect(result).toBe(0);
    });

    it('should return positive when value has more digits than required', () => {
      const result = analyzer.calculateOptionalNumbersToUse(
        '000-0000',
        '12345678',
      );

      expect(result).toBe(1);
    });

    it('should return 0 when value has fewer digits than required', () => {
      const result = analyzer.calculateOptionalNumbersToUse(
        '000-0000',
        '12345',
      );

      expect(result).toBe(0);
    });

    it('should count only required "0" tokens', () => {
      const result = analyzer.calculateOptionalNumbersToUse(
        '0009999',
        '123456789',
      );

      expect(result).toBe(6);
    });

    it('should handle pattern with no required digits', () => {
      const result = analyzer.calculateOptionalNumbersToUse('AAA-SSSS', '123');

      expect(result).toBe(3);
    });

    it('should handle empty value', () => {
      const result = analyzer.calculateOptionalNumbersToUse('000-0000', '');

      expect(result).toBe(0);
    });

    it('should handle value with non-digit characters', () => {
      const result = analyzer.calculateOptionalNumbersToUse(
        '000-0000',
        'abc123xyz456',
      );

      expect(result).toBe(0);
    });
  });

  describe('hasMoreTokens', () => {
    it('should return true when next character is a token', () => {
      const result = analyzer.hasMoreTokens('000-0000', 0, 1);

      expect(result).toBe(true);
    });

    it('should return false when at end of pattern', () => {
      const result = analyzer.hasMoreTokens('000-0000', 8, 1);

      expect(result).toBe(false);
    });

    it('should skip escape characters and find next token', () => {
      const result = analyzer.hasMoreTokens('0$-00', 1, 1);

      expect(result).toBe(true);
    });

    it('should return true for literal followed by token', () => {
      const result = analyzer.hasMoreTokens('000-0000', 3, 1);

      expect(result).toBe(true);
    });

    it('should handle reverse direction', () => {
      const result = analyzer.hasMoreTokens('000-0000', 7, -1);

      expect(result).toBe(true);
    });

    it('should return false when no more tokens in reverse', () => {
      const result = analyzer.hasMoreTokens('000-0000', -1, -1);

      expect(result).toBe(false);
    });
  });

  describe('hasMoreRecursiveTokens', () => {
    it('should return true when next character is recursive token', () => {
      const result = analyzer.hasMoreRecursiveTokens('###', 0, 1);

      expect(result).toBe(true);
    });

    it('should return false when no recursive tokens ahead', () => {
      const result = analyzer.hasMoreRecursiveTokens('000', 0, 1);

      expect(result).toBe(false);
    });

    it('should skip non-recursive tokens to find recursive', () => {
      const result = analyzer.hasMoreRecursiveTokens('000###', 0, 1);

      expect(result).toBe(true);
    });

    it('should return false at end of pattern', () => {
      const result = analyzer.hasMoreRecursiveTokens('###', 3, 1);

      expect(result).toBe(false);
    });

    it('should handle reverse direction', () => {
      const result = analyzer.hasMoreRecursiveTokens('###', 2, -1);

      expect(result).toBe(true);
    });
  });

  describe('getToken', () => {
    it('should return token for valid character', () => {
      const token = analyzer.getToken('0');

      expect(token).toBeDefined();
      expect(token?.pattern).toBeDefined();
      expect(token?.defaultValue).toBe('0');
    });

    it('should return undefined for non-token character', () => {
      const token = analyzer.getToken('-');

      expect(token).toBeUndefined();
    });

    it('should return optional token', () => {
      const token = analyzer.getToken('9');

      expect(token).toBeDefined();
      expect(token?.optional).toBe(true);
    });

    it('should return recursive token', () => {
      const token = analyzer.getToken('#');

      expect(token).toBeDefined();
      expect(token?.recursive).toBe(true);
    });

    it('should return escape token', () => {
      const token = analyzer.getToken('$');

      expect(token).toBeDefined();
      expect(token?.escape).toBe(true);
    });
  });
});
