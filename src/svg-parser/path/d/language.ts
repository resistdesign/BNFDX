import { ASTTransformMap, BaseGrammarMapType, Grammar, TokenProcessorOptionTypes } from '../../../utils/syntax-string-parser';
import {
  ClosePathCommand,
  CurveToCommand,
  EllipticalArcCommand,
  HorizontalLineToCommand,
  LineToCommand,
  MoveToCommand,
  QuadraticBezierCurveToCommand,
  SmoothCurveToCommand,
  SmoothQuadraticBezierCurveToCommand,
  SVGPathDCommand,
  VerticalLineToCommand,
} from './command-types';

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

type SVGPathDRelativeCommandTypes = 'm' | 'z' | 'l' | 'h' | 'v' | 'c' | 's' | 'q' | 't' | 'a';
type SVGPathDAbsoluteCommandTypes = 'M' | 'Z' | 'L' | 'H' | 'V' | 'C' | 'S' | 'Q' | 'T' | 'A';
type SVGPathDCommandTypes = SVGPathDRelativeCommandTypes | SVGPathDAbsoluteCommandTypes;
type UntypedSVGPathDCommand = {
  command: SVGPathDCommandTypes;
  coordinates: number[];
};
type SVGPathDCommandCoordinateType<CommandType extends SVGPathDCommand> = CommandType['coordinates'] extends Array<infer T> ? T : any;
type UntypedSVGPathDCoordinateConverterValues<CommandType extends SVGPathDCommand> = {
  coordSet: SVGPathDCommandCoordinateType<CommandType> | undefined;
  remainingCoords: number[];
};
type UntypedSVGPathDCoordinateConverter<CommandType extends SVGPathDCommand> = (
  coordinates: number[]
) => UntypedSVGPathDCoordinateConverterValues<CommandType>;

const SVG_PATH_D_TYPED_COMMAND_MAP: {
  [type in SVGPathDRelativeCommandTypes]: UntypedSVGPathDCoordinateConverter<SVGPathDCommand>;
} = {
  m: ([x, y, ...remainingCoords]): UntypedSVGPathDCoordinateConverterValues<MoveToCommand> => ({
    coordSet: {
      x,
      y,
    },
    remainingCoords,
  }),
  z: (remainingCoords): UntypedSVGPathDCoordinateConverterValues<ClosePathCommand> => ({
    coordSet: undefined as never,
    remainingCoords,
  }),
  l: ([x, y, ...remainingCoords]): UntypedSVGPathDCoordinateConverterValues<LineToCommand> => ({
    coordSet: {
      x,
      y,
    },
    remainingCoords,
  }),
  h: ([x, ...remainingCoords]): UntypedSVGPathDCoordinateConverterValues<HorizontalLineToCommand> => ({
    coordSet: {
      x,
    },
    remainingCoords,
  }),
  v: ([y, ...remainingCoords]): UntypedSVGPathDCoordinateConverterValues<VerticalLineToCommand> => ({
    coordSet: {
      y,
    },
    remainingCoords,
  }),
  c: ([x1, y1, x2, y2, x, y, ...remainingCoords]): UntypedSVGPathDCoordinateConverterValues<CurveToCommand> => ({
    coordSet: {
      x1,
      y1,
      x2,
      y2,
      x,
      y,
    },
    remainingCoords,
  }),
  s: ([x2, y2, x, y, ...remainingCoords]): UntypedSVGPathDCoordinateConverterValues<SmoothCurveToCommand> => ({
    coordSet: {
      x2,
      y2,
      x,
      y,
    },
    remainingCoords,
  }),
  q: ([x1, y1, x, y, ...remainingCoords]): UntypedSVGPathDCoordinateConverterValues<QuadraticBezierCurveToCommand> => ({
    coordSet: {
      x1,
      y1,
      x,
      y,
    },
    remainingCoords,
  }),
  t: ([x, y, ...remainingCoords]): UntypedSVGPathDCoordinateConverterValues<SmoothQuadraticBezierCurveToCommand> => ({
    coordSet: {
      x,
      y,
    },
    remainingCoords,
  }),
  a: ([
    rx,
    ry,
    xAxisRotation,
    largeArcFlag,
    sweepFlag,
    x,
    y,
    ...remainingCoords
  ]): UntypedSVGPathDCoordinateConverterValues<EllipticalArcCommand> => ({
    coordSet: {
      rx,
      ry,
      xAxisRotation,
      largeArcFlag,
      sweepFlag,
      x,
      y,
    },
    remainingCoords,
  }),
};

const getTypedSVGPathDCommand = ({ command, coordinates = [] }: UntypedSVGPathDCommand): SVGPathDCommand => {
  const newCoordinates: any[] = [];
  const coordConverter = SVG_PATH_D_TYPED_COMMAND_MAP[command.toLowerCase() as SVGPathDRelativeCommandTypes];

  let coordList = coordinates;

  while (coordList.length) {
    const { coordSet, remainingCoords } = coordConverter(coordList);

    if (coordSet) {
      newCoordinates.push(coordSet);
    } else {
      // TRICKY: If there is no coordSet then this coordinates array should be empty.
      break;
    }

    coordList = remainingCoords;
  }

  return {
    command: command as any,
    coordinates: newCoordinates,
  };
};

export const SVGPathDASTTransformMap: ASTTransformMap<SVGPathDTokenTypes> = {
  white_space: () => '',
  optional_white_space: () => '',
  one_or_more_white_space: () => '',
  divider: () => '',
  command: ({ value }) => getTypedSVGPathDCommand({ command: value as SVGPathDCommandTypes, coordinates: [] }),
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
