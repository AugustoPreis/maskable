import {
  defaultTokenRegistry,
  createTokenRegistry,
} from '../src/token-registry';
import { TokenRegistry } from '../src/types';

describe('Token Registry', () => {
  describe('defaultTokenRegistry', () => {
    it('should define token "0" for required digits', () => {
      const token = defaultTokenRegistry['0'];

      expect(token).toBeDefined();
      if (!token) return;
      expect(token.pattern).toBeDefined();
      expect(token.pattern?.test('5')).toBe(true);
      expect(token.pattern?.test('a')).toBe(false);
      expect(token.defaultValue).toBe('0');
    });

    it('should define token "9" for optional digits', () => {
      const token = defaultTokenRegistry['9'];

      expect(token).toBeDefined();
      if (!token) return;
      expect(token.pattern).toBeDefined();
      expect(token.pattern?.test('7')).toBe(true);
      expect(token.pattern?.test('x')).toBe(false);
      expect(token.optional).toBe(true);
    });

    it('should define token "#" for recursive digits', () => {
      const token = defaultTokenRegistry['#'];

      expect(token).toBeDefined();
      if (!token) return;
      expect(token.pattern).toBeDefined();
      expect(token.pattern?.test('3')).toBe(true);
      expect(token.optional).toBe(true);
      expect(token.recursive).toBe(true);
    });

    it('should define token "A" for alphanumeric', () => {
      const token = defaultTokenRegistry['A'];

      expect(token).toBeDefined();
      if (!token) return;
      expect(token.pattern).toBeDefined();
      expect(token.pattern?.test('a')).toBe(true);
      expect(token.pattern?.test('Z')).toBe(true);
      expect(token.pattern?.test('5')).toBe(true);
      expect(token.pattern?.test('!')).toBe(false);
    });

    it('should define token "S" for letters', () => {
      const token = defaultTokenRegistry['S'];

      expect(token).toBeDefined();
      if (!token) return;
      expect(token.pattern).toBeDefined();
      expect(token.pattern?.test('a')).toBe(true);
      expect(token.pattern?.test('Z')).toBe(true);
      expect(token.pattern?.test('5')).toBe(false);
    });

    it('should define token "U" for uppercase letters', () => {
      const token = defaultTokenRegistry['U'];

      expect(token).toBeDefined();
      if (!token) return;
      expect(token.pattern).toBeDefined();
      expect(token.pattern?.test('a')).toBe(true);
      expect(token.pattern?.test('Z')).toBe(true);
      expect(token.transform).toBeDefined();
      expect(token.transform?.('a')).toBe('A');
      expect(token.transform?.('z')).toBe('Z');
    });

    it('should define token "L" for lowercase letters', () => {
      const token = defaultTokenRegistry['L'];

      expect(token).toBeDefined();
      if (!token) return;
      expect(token.pattern).toBeDefined();
      expect(token.pattern?.test('a')).toBe(true);
      expect(token.pattern?.test('Z')).toBe(true);
      expect(token.transform).toBeDefined();
      expect(token.transform?.('A')).toBe('a');
      expect(token.transform?.('Z')).toBe('z');
    });

    it('should define token "$" as escape character', () => {
      const token = defaultTokenRegistry['$'];

      expect(token).toBeDefined();
      if (!token) return;
      expect(token.escape).toBe(true);
    });
  });

  describe('createTokenRegistry', () => {
    it('should return default registry when no custom tokens provided', () => {
      const registry = createTokenRegistry();

      expect(registry).toEqual(defaultTokenRegistry);
    });

    it('should merge custom tokens with default registry', () => {
      const customTokens: Partial<TokenRegistry> = {
        X: { pattern: /[0-9A-F]/ },
      };

      const registry = createTokenRegistry(customTokens);

      expect(registry['0']).toBeDefined();
      expect(registry['X']).toBeDefined();
      const tokenX = registry['X'];
      if (!tokenX) return;
      expect(tokenX.pattern?.test('5')).toBe(true);
      expect(tokenX.pattern?.test('A')).toBe(true);
      expect(tokenX.pattern?.test('G')).toBe(false);
    });

    it('should override default tokens with custom tokens', () => {
      const customTokens: Partial<TokenRegistry> = {
        '0': { pattern: /[a-z]/, defaultValue: 'x' },
      };

      const registry = createTokenRegistry(customTokens);

      const token0 = registry['0'];
      if (!token0) return;
      expect(token0.pattern?.test('a')).toBe(true);
      expect(token0.pattern?.test('5')).toBe(false);
      expect(token0.defaultValue).toBe('x');
    });

    it('should handle multiple custom tokens', () => {
      const customTokens: Partial<TokenRegistry> = {
        X: { pattern: /[0-9A-F]/ },
        Y: { pattern: /[!@#$%]/ },
        Z: { pattern: /./, recursive: true },
      };

      const registry = createTokenRegistry(customTokens);

      expect(registry['X']).toBeDefined();
      expect(registry['Y']).toBeDefined();
      expect(registry['Z']).toBeDefined();
      const tokenZ = registry['Z'];
      if (!tokenZ) return;
      expect(tokenZ.recursive).toBe(true);
    });
  });
});
