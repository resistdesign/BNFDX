import { AST, parseSyntaxString, transformAST } from '../../../utils/syntax-string-parser';
import { SVGPathDASTTransformMap, SVGPathDGrammar, SVGPathDTokenTypes } from './language';
import { SVGPathDCommand } from './command-types';

export const svgPathDParser = (syntaxString: string = ''): SVGPathDCommand[] | false => {
  const ast: AST<SVGPathDTokenTypes> | false = parseSyntaxString<SVGPathDTokenTypes>(syntaxString, SVGPathDGrammar);

  return ast ? transformAST(ast, SVGPathDASTTransformMap) : ast;
};
