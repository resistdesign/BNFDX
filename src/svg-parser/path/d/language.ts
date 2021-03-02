import { ASTTransformMap, BaseGrammarMapType, Grammar, TokenProcessorOptionTypes } from '../../../utils/syntax-string-parser';
import { MoveToCommand, SVGPathDCommand } from './command-types';

export type SVGPathDTokenTypes =
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
  input: {
    options: [
      [
        'optional_white_space',
        {
          value: ['command_value_set_group', 'optional_white_space'],
          option: TokenProcessorOptionTypes.ZERO_OR_MORE,
        },
        'optional_white_space',
      ],
    ],
  },
  digit: {
    options: [/[0-9]/],
  },
  digit_set: {
    options: ['digit', ['digit', 'digit_set']],
  },
  white_space: { options: [/ /, /\t/, /\n/] },
  optional_white_space: {
    options: [
      {
        value: 'white_space',
        option: TokenProcessorOptionTypes.ZERO_OR_MORE,
      },
    ],
  },
  one_or_more_white_space: {
    options: [
      {
        value: 'white_space',
        option: TokenProcessorOptionTypes.ONE_OR_MORE,
      },
    ],
  },
  decimal: { options: [/\./] },
  operator: { options: [/\+/, /-/] },
  divider: { options: [/,/, 'one_or_more_white_space'] },
  value: {
    options: [
      'digit_set',
      ['digit_set', 'decimal', 'digit_set'],
      ['decimal', 'digit_set'],
      ['operator', 'digit_set'],
      ['operator', 'digit_set', 'decimal', 'digit_set'],
      ['operator', 'decimal', 'digit_set'],
    ],
  },
  value_set: {
    options: ['value', ['value', 'value_set'], ['value', 'divider', 'value_set']],
  },
  command: {
    options: [/[mzlhvcsqtaMZLHVCSQTA]/i],
  },
  command_value_set_group: {
    options: ['command', ['command', 'optional_white_space', 'value_set'], ['command', 'optional_white_space', 'command_value_set_group']],
  },
};

export const SVGPathDGrammar: Grammar<SVGPathDTokenTypes> = {
  entry: 'input',
  map: SVGPathDGrammarMap,
};

const flattenAndClean = (value: any[] | any): typeof value =>
  value instanceof Array
    ? value.reduce(
        (acc, subValue) => (subValue instanceof Array ? [...acc, ...flattenAndClean(subValue)] : subValue === '' ? acc : [...acc, subValue]),
        []
      )
    : value;

type UntypedSVGPathDCommand = {
  command: 'm' | 'z' | 'l' | 'h' | 'v' | 'c' | 's' | 'q' | 't' | 'a' | 'M' | 'Z' | 'L' | 'H' | 'V' | 'C' | 'S' | 'Q' | 'T' | 'A';
  coordinates: number[];
};
type UntypedSVGPathDCommandConverter = (untypedCommand: UntypedSVGPathDCommand) => SVGPathDCommand;

const BASE_COMMAND_MAP = {
  m: ({ command, coordinates }): MoveToCommand => {
    const newCoordinates: { x: number; y: number }[] = [];

    let coordList = coordinates;

    while (coordList.length) {
      const [x = 0, y = 0, ...more] = coordList;

      newCoordinates.push({ x, y });

      coordList = more;
    }

    return {
      command,
      coordinates: newCoordinates,
    };
  },
};
const SVG_PATH_D_TYPED_COMMAND_MAP: {
  [type in UntypedSVGPathDCommand['command']]: UntypedSVGPathDCommandConverter;
} = {
  m: BASE_COMMAND_MAP.m,
  M: BASE_COMMAND_MAP.m,
};

const getTypedSVGPathDCommand = (untypedCommand: UntypedSVGPathDCommand): SVGPathDCommand =>
  SVG_PATH_D_TYPED_COMMAND_MAP[untypedCommand.command](untypedCommand);

export const SVGPathDASTTransformMap: ASTTransformMap<SVGPathDTokenTypes> = {
  white_space: () => '',
  optional_white_space: () => '',
  one_or_more_white_space: () => '',
  divider: () => '',
  command: ({ value }) => getTypedSVGPathDCommand({ command: value, coordinates: [] }),
  command_value_set_group: ({ transformedValue: [{ command }, ...coordinates] = [] }) =>
    getTypedSVGPathDCommand({
      command,
      coordinates: flattenAndClean(coordinates).map((c: string) => parseFloat(c)),
    }),
  input: ({ transformedValue }) => flattenAndClean(transformedValue),
  operator: ({ value }) => value,
  decimal: ({ value }) => value,
  digit: ({ value }) => value,
  digit_set: ({ transformedValue = [] }) => transformedValue.join(''),
  value: ({ transformedValue = [] }) => transformedValue.join(''),
  value_set: ({ transformedValue = [] }) => transformedValue,
};
