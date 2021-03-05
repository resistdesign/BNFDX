import { BaseGrammarMapType, Grammar, TokenProcessorOptionTypes } from '../../../utils/syntax-string-parser';

export type SVGPolygonPointsTokenTypes =
  | 'list_of_points'
  | 'coordinate_pairs'
  | 'coordinate_pair'
  | 'coordinate'
  | 'number'
  | 'negative_coordinate'
  | 'comma_wsp'
  | 'comma'
  | 'integer_constant'
  | 'floating_point_constant'
  | 'fractional_constant'
  | 'exponent'
  | 'sign'
  | 'digit_sequence'
  | 'digit'
  | 'wsp';

const SVGPolygonPointsGrammarMap: BaseGrammarMapType<SVGPolygonPointsTokenTypes> = {
  list_of_points: {
    options: [
      [
        { value: 'wsp', option: TokenProcessorOptionTypes.ZERO_OR_MORE },
        { value: 'coordinate_pairs', option: TokenProcessorOptionTypes.ZERO_OR_ONE },
        { value: 'wsp', option: TokenProcessorOptionTypes.ZERO_OR_MORE },
      ],
    ],
  },
  coordinate_pairs: {
    options: ['coordinate_pair', ['coordinate_pair', 'comma_wsp', 'coordinate_pairs']],
  },
  coordinate_pair: {
    options: [
      ['coordinate', 'comma_wsp', 'coordinate'],
      ['coordinate', 'negative_coordinate'],
    ],
  },
  coordinate: { options: ['number'] },
  number: {
    options: [
      [{ value: 'sign', option: TokenProcessorOptionTypes.ZERO_OR_ONE }, 'integer_constant'],
      [{ value: 'sign', option: TokenProcessorOptionTypes.ZERO_OR_ONE }, 'floating_point_constant'],
    ],
  },
  negative_coordinate: {
    options: [
      [/[-]/, 'integer_constant'],
      [/[-]/, 'floating_point_constant'],
    ],
  },
  comma_wsp: {
    options: [
      [
        { value: 'wsp', option: TokenProcessorOptionTypes.ONE_OR_MORE },
        { value: 'comma', option: TokenProcessorOptionTypes.ZERO_OR_ONE },
        { value: 'wsp', option: TokenProcessorOptionTypes.ZERO_OR_MORE },
      ],
      ['comma', { value: 'wsp', option: TokenProcessorOptionTypes.ZERO_OR_MORE }],
    ],
  },
  comma: { options: [/[,]/] },
  integer_constant: { options: ['digit_sequence'] },
  floating_point_constant: {
    options: [
      ['fractional_constant', { value: 'exponent', option: TokenProcessorOptionTypes.ZERO_OR_ONE }],
      ['digit_sequence', 'exponent'],
    ],
  },
  fractional_constant: {
    options: [
      [{ value: 'digit_sequence', option: TokenProcessorOptionTypes.ZERO_OR_ONE }, /\./, 'digit_sequence'],
      ['digit_sequence', /\./],
    ],
  },
  exponent: {
    options: [[/[eE]/, { value: 'sign', option: TokenProcessorOptionTypes.ZERO_OR_ONE }, 'digit_sequence']],
  },
  sign: {
    options: [/[+-]/],
  },
  digit_sequence: {
    options: ['digit', ['digit', 'digit_sequence']],
  },
  digit: { options: [/[0-9]/] },
  wsp: { options: [/ /, /\t/, /\n/] },
};

export const SVGPolygonPointsGrammar: Grammar<SVGPolygonPointsTokenTypes> = {
  entry: 'list_of_points',
  map: SVGPolygonPointsGrammarMap,
};
