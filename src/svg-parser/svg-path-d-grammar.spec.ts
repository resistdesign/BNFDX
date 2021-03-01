import Path from 'path';
import FS from 'fs';
import { AST, astToSyntaxString, parseSyntaxString, transformAST } from './syntax-string-parser';
import { SVGPathDASTTransformMap, SVGPathDGrammar, SVGPathDTokenTypes } from './svg-path-d-grammar';

const DEMO_PATH_D: string = FS.readFileSync(Path.join(__dirname, 'demo-path-d.txt'), { encoding: 'utf8' });
const PATH_D_AST = parseSyntaxString<SVGPathDTokenTypes>(DEMO_PATH_D, SVGPathDGrammar);

describe('SVG Parser', () => {
  describe('SVG Path D Grammar', () => {
    test('should enable parsing of path d commands', () => {
      expect(PATH_D_AST).toBeTruthy();
    });
  });

  describe('SVG Path D AST Transform Map', () => {
    test('should enable transforming path d ASTs to command-coordinate structures', () => {
      const result = transformAST(PATH_D_AST as AST<SVGPathDTokenTypes>, SVGPathDASTTransformMap);

      expect(result).toBeTruthy();
    });
  });

  describe('SVG Path D astToSyntaxString', () => {
    test('should convert an AST back to the exact, origin syntax string it had been generated from', () => {
      const result = astToSyntaxString(PATH_D_AST as AST<SVGPathDTokenTypes>);

      expect(result).toStrictEqual(DEMO_PATH_D);
    });
  });
});
