import { BaseGrammarMapType, Grammar, TokenProcessorOptionTypes } from './syntax-string-parser';

type SVGPathDTokenTypes =
  | 'input'
  | 'digit'
  | 'digit_set'
  | 'white_space'
  | 'optional_white_space'
  | 'one_or_more_white_space'
  | 'decimal'
  | 'operator'
  | 'divider'
  | 'value'
  | 'value_set'
  | 'command'
  | 'command_value_set_group';

const SVGPathDGrammarMap: BaseGrammarMapType<SVGPathDTokenTypes> = {
  input: ['optional_white_space', 'command_value_set_group', 'optional_white_space'],
  digit: /[0-9]/,
  digit_set: ['digit', ['digit', 'digit_set']],
  white_space: [/ /, /\t/, /\n/],
  optional_white_space: {
    value: 'white_space',
    option: TokenProcessorOptionTypes['*'],
  },
  one_or_more_white_space: {
    value: 'white_space',
    option: TokenProcessorOptionTypes['+'],
  },
  decimal: /\./,
  operator: [/\+/, /-/],
  divider: [/,/, 'one_or_more_white_space', 'operator', 'decimal'],
  value: [
    'digit_set',
    ['operator', 'digit_set'],
    ['decimal', 'digit_set'],
    ['operator', 'decimal', 'digit_set'],
    ['digit_set', 'decimal', 'digit_set'],
    ['operator', 'digit_set', 'decimal', 'digit_set'],
  ],
  value_set: ['value', ['value', 'divider', 'value_set']],
  command: /[a-z]/i,
  command_value_set_group: ['command', 'optional_white_space', 'value_set_x' /* looking for error */],
};

export const SVGPathDGrammar: Grammar<SVGPathDTokenTypes> = {
  entry: 'taco', // looking for error
  map: SVGPathDGrammarMap,
};
