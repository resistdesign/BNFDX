import Path from 'path';
import FS from 'fs';
import { AST, astToSyntaxString, parseSyntaxString, transformAST } from './syntax-string-parser';
import { SVGPathDASTTransformMap, SVGPathDGrammar, SVGPathDTokenTypes } from '../svg-parser/path/d/language';

const DEMO_PATH_D: string = FS.readFileSync(Path.join(__dirname, 'mock-data.txt'), { encoding: 'utf8' });
const PATH_D_AST = parseSyntaxString<SVGPathDTokenTypes>(DEMO_PATH_D, SVGPathDGrammar);

describe('Syntax String Parser', () => {
  describe('parseSyntaxString', () => {
    test('should parse a syntax string', () => {
      expect(PATH_D_AST).toBeTruthy();
    });
  });

  describe('transformAST', () => {
    test('should transforming token ASTs to language specific AST-like structures', () => {
      const result = transformAST(PATH_D_AST as AST<SVGPathDTokenTypes>, SVGPathDASTTransformMap);

      expect(result).toBeTruthy();
    });
  });

  describe('astToSyntaxString', () => {
    test('should convert a token AST back to the exact, origin syntax string it had been generated from', () => {
      const result = astToSyntaxString(PATH_D_AST as AST<SVGPathDTokenTypes>);

      expect(result).toStrictEqual(DEMO_PATH_D);
    });
  });
});
