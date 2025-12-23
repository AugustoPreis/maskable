/**
 * StringMask - Modern String Masking Library
 *
 * A type-safe TypeScript library for applying masks to strings,
 * with support for customizable tokens, reverse processing, and validation.
 */
import { StringMasker } from './src/string-masker';

export type {
  MaskToken,
  MaskOptions,
  MaskResult,
  TokenRegistry,
} from './src/types';

export { ProcessingDirection } from './src/types';

export {
  defaultTokenRegistry,
  createTokenRegistry,
} from './src/token-registry';

export { PatternAnalyzer } from './src/pattern-analyzer';
export { StringProcessor } from './src/string-processor';
export { MaskProcessor } from './src/mask-processor';
export { StringMasker };

export default StringMasker;
