import Path from 'path';
import FS from 'fs';
import { parseSyntaxString } from './syntax-string-parser';
import { SVGPathDGrammar } from './svg-path-d-grammar';

const DEMO_PATH_D: string = FS.readFileSync(Path.join(__dirname, 'demo-path-d.txt'), { encoding: 'utf8' });

describe('SVG Parser', () => {
  describe('SVG Path D Grammar', () => {
    test('should enable parsing of path d commands', () => {
      const result = parseSyntaxString(DEMO_PATH_D, SVGPathDGrammar);

      console.log('SVG Path D AST', JSON.stringify(result, null, 2));

      expect(result).toBeTruthy();
    });
  });
});
