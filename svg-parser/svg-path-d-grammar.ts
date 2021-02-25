import { BaseGrammarMapType, Grammar } from './syntax-string-parser';

type SvgPathDGrammarMapType = {
  input: any;
  digit: any;
  digit_set: any;
  white_space: any;
  optional_white_space: any;
  one_or_more_white_space: any;
  decimal: any;
  operator: any;
  divider: any;
  value: any;
  value_set: any;
  command: any;
  command_value_set_group: any;
};

const SVGPathDGrammarMap: BaseGrammarMapType<SvgPathDGrammarMapType> = {
  input: ['optional_white_space', 'command_value_set_group', 'optional_white_space'],
  digit: /[0-9]/,
  digit_set: ['digit', ['digit', 'digit_set']],
  white_space: [/ /, /\t/, /\n/],
  optional_white_space: {
    value: 'white_space',
    option: '*',
  },
  one_or_more_white_space: {
    value: 'white_space',
    option: '+',
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
  command_value_set_group: ['command', 'optional_white_space', 'value_set'],
};

export const SVGPathDGrammar: Grammar<SvgPathDGrammarMapType> = {
  entry: 'command',
  map: SVGPathDGrammarMap,
};
