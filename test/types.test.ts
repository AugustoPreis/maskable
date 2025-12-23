import {
  MaskToken,
  MaskOptions,
  MaskResult,
  ProcessingDirection,
  IterationConfig,
  TokenRegistry,
} from '../src/types';

describe('Types', () => {
  describe('MaskToken', () => {
    it('should allow defining a token with pattern only', () => {
      const token: MaskToken = {
        pattern: /\d/,
      };

      expect(token.pattern).toBeDefined();
      expect(token.optional).toBeUndefined();
    });

    it('should allow defining an optional token', () => {
      const token: MaskToken = {
        pattern: /\d/,
        optional: true,
      };

      expect(token.optional).toBe(true);
    });

    it('should allow defining a recursive token', () => {
      const token: MaskToken = {
        pattern: /\d/,
        recursive: true,
      };

      expect(token.recursive).toBe(true);
    });

    it('should allow defining a token with default value', () => {
      const token: MaskToken = {
        pattern: /\d/,
        defaultValue: '0',
      };

      expect(token.defaultValue).toBe('0');
    });

    it('should allow defining an escape token', () => {
      const token: MaskToken = {
        escape: true,
      };

      expect(token.escape).toBe(true);
    });

    it('should allow defining a token with transform function', () => {
      const transformFn = (char: string) => char.toUpperCase();
      const token: MaskToken = {
        pattern: /[a-z]/,
        transform: transformFn,
      };

      expect(token.transform).toBe(transformFn);
      expect(token.transform?.('a')).toBe('A');
    });
  });

  describe('MaskOptions', () => {
    it('should allow defining options with reverse', () => {
      const options: MaskOptions = {
        reverse: true,
      };

      expect(options.reverse).toBe(true);
    });

    it('should allow defining options with useDefaults', () => {
      const options: MaskOptions = {
        useDefaults: true,
      };

      expect(options.useDefaults).toBe(true);
    });

    it('should allow defining both options', () => {
      const options: MaskOptions = {
        reverse: true,
        useDefaults: true,
      };

      expect(options.reverse).toBe(true);
      expect(options.useDefaults).toBe(true);
    });
  });

  describe('MaskResult', () => {
    it('should define a valid result', () => {
      const result: MaskResult = {
        result: '123-456',
        valid: true,
      };

      expect(result.result).toBe('123-456');
      expect(result.valid).toBe(true);
    });

    it('should define an invalid result', () => {
      const result: MaskResult = {
        result: '123',
        valid: false,
      };

      expect(result.result).toBe('123');
      expect(result.valid).toBe(false);
    });
  });

  describe('ProcessingDirection', () => {
    it('should define FORWARD as 1', () => {
      expect(ProcessingDirection.FORWARD).toBe(1);
    });

    it('should define REVERSE as -1', () => {
      expect(ProcessingDirection.REVERSE).toBe(-1);
    });
  });

  describe('IterationConfig', () => {
    it('should define forward iteration config', () => {
      const config: IterationConfig = {
        start: 0,
        end: 10,
        increment: ProcessingDirection.FORWARD,
      };

      expect(config.start).toBe(0);
      expect(config.end).toBe(10);
      expect(config.increment).toBe(1);
    });

    it('should define reverse iteration config', () => {
      const config: IterationConfig = {
        start: 10,
        end: 0,
        increment: ProcessingDirection.REVERSE,
      };

      expect(config.start).toBe(10);
      expect(config.end).toBe(0);
      expect(config.increment).toBe(-1);
    });
  });

  describe('TokenRegistry', () => {
    it('should define a registry with multiple tokens', () => {
      const registry: TokenRegistry = {
        '0': { pattern: /\d/, defaultValue: '0' },
        '9': { pattern: /\d/, optional: true },
        A: { pattern: /[a-zA-Z0-9]/ },
      };

      expect(registry['0']).toBeDefined();
      expect(registry['9']).toBeDefined();
      expect(registry['A']).toBeDefined();
    });
  });
});
