import { StringMasker } from '../src/string-masker';
import { TokenRegistry } from '../src/types';

describe('StringMasker', () => {
  describe('constructor', () => {
    it('should create instance with pattern only', () => {
      const masker = new StringMasker('000-0000');

      expect(masker).toBeDefined();
    });

    it('should create instance with pattern and options', () => {
      const masker = new StringMasker('000-0000', { reverse: true });

      expect(masker).toBeDefined();
    });

    it('should create instance with custom token registry', () => {
      const customRegistry: TokenRegistry = {
        X: { pattern: /[0-9A-F]/ },
      };
      const masker = new StringMasker('XXX', {}, customRegistry);

      expect(masker).toBeDefined();
    });
  });

  describe('process', () => {
    it('should return result and validity', () => {
      const masker = new StringMasker('000-0000');
      const result = masker.process('1234567');

      expect(result).toHaveProperty('result');
      expect(result).toHaveProperty('valid');
      expect(result.result).toBe('123-4567');
      expect(result.valid).toBe(true);
    });

    it('should handle null value', () => {
      const masker = new StringMasker('000-0000');
      const result = masker.process(null);

      expect(result.result).toBe('');
      expect(result.valid).toBe(false);
    });

    it('should handle undefined value', () => {
      const masker = new StringMasker('000-0000');
      const result = masker.process(undefined);

      expect(result.result).toBe('');
      expect(result.valid).toBe(false);
    });

    it('should handle number value', () => {
      const masker = new StringMasker('000-0000');
      const result = masker.process(1234567);

      expect(result.result).toBe('123-4567');
      expect(result.valid).toBe(true);
    });

    it('should handle empty string', () => {
      const masker = new StringMasker('000-0000');
      const result = masker.process('');

      expect(result.result).toBe('');
      expect(result.valid).toBe(false);
    });
  });

  describe('apply', () => {
    it('should return only the formatted result', () => {
      const masker = new StringMasker('000-0000');
      const result = masker.apply('1234567');

      expect(typeof result).toBe('string');
      expect(result).toBe('123-4567');
    });

    it('should return empty string for null', () => {
      const masker = new StringMasker('000-0000');
      const result = masker.apply(null);

      expect(result).toBe('');
    });

    it('should apply phone mask', () => {
      const masker = new StringMasker('(000) 000-0000');
      const result = masker.apply('1234567890');

      expect(result).toBe('(123) 456-7890');
    });

    it('should apply CPF mask', () => {
      const masker = new StringMasker('000.000.000-00');
      const result = masker.apply('12345678901');

      expect(result).toBe('123.456.789-01');
    });
  });

  describe('validate', () => {
    it('should return true for valid input', () => {
      const masker = new StringMasker('000-0000');
      const isValid = masker.validate('1234567');

      expect(isValid).toBe(true);
    });

    it('should return false for invalid input', () => {
      const masker = new StringMasker('000-0000');
      const isValid = masker.validate('12345');

      expect(isValid).toBe(false);
    });

    it('should return false for non-numeric in numeric mask', () => {
      const masker = new StringMasker('0000');
      const isValid = masker.validate('abcd');

      expect(isValid).toBe(false);
    });

    it('should return false for null', () => {
      const masker = new StringMasker('000-0000');
      const isValid = masker.validate(null);

      expect(isValid).toBe(false);
    });
  });

  describe('static process', () => {
    it('should process without creating instance', () => {
      const result = StringMasker.process('1234567', '000-0000');

      expect(result.result).toBe('123-4567');
      expect(result.valid).toBe(true);
    });

    it('should accept options in static method', () => {
      const result = StringMasker.process('123456', '000.000,00', {
        reverse: true,
      });

      expect(result.result).toBe('001.234,56');
      expect(result.valid).toBe(true);
    });
  });

  describe('static apply', () => {
    it('should apply without creating instance', () => {
      const result = StringMasker.apply('1234567', '000-0000');

      expect(result).toBe('123-4567');
    });

    it('should apply with reverse option', () => {
      const result = StringMasker.apply('123456', '000.000,00', {
        reverse: true,
      });

      expect(result).toBe('001.234,56');
    });
  });

  describe('static validate', () => {
    it('should validate without creating instance', () => {
      const isValid = StringMasker.validate('1234567', '000-0000');

      expect(isValid).toBe(true);
    });

    it('should return false for invalid value', () => {
      const isValid = StringMasker.validate('12345', '000-0000');

      expect(isValid).toBe(false);
    });
  });

  describe('options - reverse', () => {
    it('should process in reverse when option is true', () => {
      const masker = new StringMasker('000.000,00', { reverse: true });
      const result = masker.apply('123456');

      expect(result).toBe('001.234,56');
    });

    it('should process forward when option is false', () => {
      const masker = new StringMasker('000.000,00', { reverse: false });
      const result = masker.apply('123456');

      expect(result).toBe('123.456,');
    });

    it('should default to false when not specified', () => {
      const masker = new StringMasker('000-0000');
      const result = masker.apply('1234567');

      expect(result).toBe('123-4567');
    });
  });

  describe('options - useDefaults', () => {
    it('should use default values when option is true', () => {
      const masker = new StringMasker('000-0000', { useDefaults: true });
      const result = masker.apply('123');

      expect(result).toBe('123-0000');
    });

    it('should not use default values when option is false', () => {
      const masker = new StringMasker('000-0000', { useDefaults: false });
      const result = masker.apply('123');

      expect(result).toBe('123-');
    });

    it('should default to reverse option value', () => {
      const maskerReverse = new StringMasker('000,00', { reverse: true });
      const resultReverse = maskerReverse.apply('1');
      expect(resultReverse).toBe('000,01');

      const maskerForward = new StringMasker('000-00', { reverse: false });
      const resultForward = maskerForward.apply('1');
      expect(resultForward).toBe('1-');
    });
  });

  describe('custom token registry', () => {
    it('should use custom tokens', () => {
      const customRegistry: TokenRegistry = {
        X: { pattern: /[0-9A-F]/ },
      };
      const masker = new StringMasker('XX-XX', {}, customRegistry);
      const result = masker.apply('12AB');

      expect(result).toBe('12-AB');
    });

    it('should validate with custom tokens', () => {
      const customRegistry: TokenRegistry = {
        X: { pattern: /[0-9A-F]/ },
      };
      const masker = new StringMasker('XXXX', {}, customRegistry);

      expect(masker.validate('12AB')).toBe(true);
      expect(masker.validate('12GH')).toBe(false);
    });
  });

  describe('real world examples', () => {
    it('should format Brazilian phone number', () => {
      const masker = new StringMasker('(00) 0000-0000');
      expect(masker.apply('11987654321')).toBe('(11) 9876-5432');
    });

    it('should format Brazilian mobile with 9th digit', () => {
      const masker = new StringMasker('(00) 00000-0000');
      expect(masker.apply('11987654321')).toBe('(11) 98765-4321');
    });

    it('should format credit card number', () => {
      const masker = new StringMasker('0000 0000 0000 0000');
      expect(masker.apply('4111111111111111')).toBe('4111 1111 1111 1111');
    });

    it('should format date', () => {
      const masker = new StringMasker('00/00/0000');
      expect(masker.apply('25122025')).toBe('25/12/2025');
    });

    it('should format currency in reverse', () => {
      const masker = new StringMasker('R$ #.###.###,00', { reverse: true });
      expect(masker.apply('1234567')).toBe('12.345,67');
    });

    it('should format large currency values', () => {
      const masker = new StringMasker('R$ #.###.###,00', { reverse: true });
      expect(masker.apply('123456789')).toBe('1.234.567,89');
    });

    it('should format CEP', () => {
      const masker = new StringMasker('00000-000');
      expect(masker.apply('01310100')).toBe('01310-100');
    });

    it('should format CNPJ', () => {
      const masker = new StringMasker('00.000.000/0000-00');
      expect(masker.apply('12345678000199')).toBe('12.345.678/0001-99');
    });
  });
});
