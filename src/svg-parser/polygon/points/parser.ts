import { AST, parseSyntaxString, transformAST } from '../../../utils/syntax-string-parser';
import { SVGPolygonPointsASTTransformMap, SVGPolygonPointsGrammar, SVGPolygonPointsTokenTypes } from './language';
import { SVGPoint } from './types';

export const svgPolygonPointsParser = (syntaxString: string = ''): SVGPoint[] | false => {
  const ast: AST<SVGPolygonPointsTokenTypes> | false = parseSyntaxString<SVGPolygonPointsTokenTypes>(syntaxString, SVGPolygonPointsGrammar);

  return ast ? transformAST(ast, SVGPolygonPointsASTTransformMap) : ast;
};
