export const SVGPathDGrammar = {
  entry: 'input',
  map: {
    input: ['optional_white_space', 'command_value_set_group', 'optional_white_space'],
    digit: /[0-9]/,
    digit_set: ['digit', ['digit', 'digit_set']],
    white_space: [/ /, /\t/, /\n/],
    optional_white_space: {
      value: 'ws',
      option: '*',
    },
    one_or_more_white_space: {
      value: 'ws',
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
  },
};
