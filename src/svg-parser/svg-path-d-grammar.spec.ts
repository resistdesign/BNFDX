import Path from 'path';
import FS from 'fs';
import { AST, parseSyntaxString, transformAST } from './syntax-string-parser';
import { SVGPathDASTTransformMap, SVGPathDGrammar, SVGPathDTokenTypes } from './svg-path-d-grammar';

const DEMO_PATH_D: string = FS.readFileSync(Path.join(__dirname, 'demo-path-d.txt'), { encoding: 'utf8' });
const PATH_D_AST = parseSyntaxString<SVGPathDTokenTypes>(DEMO_PATH_D, SVGPathDGrammar);

describe('SVG Parser', () => {
  describe('SVG Path D Grammar', () => {
    test('should enable parsing of path d commands', () => {
      console.log('SVG Path D AST:', JSON.stringify(PATH_D_AST, null, 2));

      expect(PATH_D_AST).toBeTruthy();
    });
  });

  describe('SVG Path D AST Transform Map', () => {
    test('should enable transforming path d ASTs to command-coordinate structures', () => {
      const result = transformAST(PATH_D_AST as AST<SVGPathDTokenTypes>, SVGPathDASTTransformMap);

      console.log('SVG Path D Command-Coordinates:', JSON.stringify(result, null, 2));

      expect(result).toBeTruthy();
    });
  });
});
