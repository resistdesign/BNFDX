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
// import { flattenAndClean } from '../../common/transform-utils';

export type SVGPathDTokenTypes =
  | 'svg-path'
  | 'moveto-drawto-command-groups'
  | 'moveto-drawto-command-group'
  | 'drawto-commands'
  | 'drawto-command'
  | 'moveto'
  | 'moveto-argument-sequence'
  | 'closepath'
  | 'lineto'
  | 'lineto-argument-sequence'
  | 'horizontal-lineto'
  | 'horizontal-lineto-argument-sequence'
  | 'vertical-lineto'
  | 'vertical-lineto-argument-sequence'
  | 'curveto'
  | 'curveto-argument-sequence'
  | 'curveto-argument'
  | 'smooth-curveto'
  | 'smooth-curveto-argument-sequence'
  | 'smooth-curveto-argument'
  | 'quadratic-bezier-curveto'
  | 'quadratic-bezier-curveto-argument-sequence'
  | 'quadratic-bezier-curveto-argument'
  | 'smooth-quadratic-bezier-curveto'
  | 'smooth-quadratic-bezier-curveto-argument-sequence'
  | 'elliptical-arc'
  | 'elliptical-arc-argument-sequence'
  | 'elliptical-arc-argument'
  | 'coordinate-pair'
  | 'coordinate'
  | 'nonnegative-number'
  | 'number'
  | 'flag'
  | 'comma-wsp'
  | 'comma'
  | 'integer-constant'
  | 'floating-point-constant'
  | 'fractional-constant'
  | 'exponent'
  | 'sign'
  | 'digit-sequence'
  | 'digit'
  | 'wsp';

const SVGPathDGrammarMap: BaseGrammarMapType<SVGPathDTokenTypes> = {
  'svg-path': {
    options: [
      [
        { value: 'wsp', option: TokenProcessorOptionTypes.ZERO_OR_MORE },
        {
          value: 'moveto-drawto-command-groups',
          option: TokenProcessorOptionTypes.ZERO_OR_ONE,
        },
        { value: 'wsp', option: TokenProcessorOptionTypes.ZERO_OR_MORE },
      ],
    ],
  },
  'moveto-drawto-command-groups': {
    options: [
      'moveto-drawto-command-group',
      [
        'moveto-drawto-command-group',
        {
          value: 'wsp',
          option: TokenProcessorOptionTypes.ZERO_OR_MORE,
        },
        'moveto-drawto-command-groups',
      ],
    ],
  },
  'moveto-drawto-command-group': {
    options: [
      [
        'moveto',
        { value: 'wsp', option: TokenProcessorOptionTypes.ZERO_OR_MORE },
        {
          value: 'drawto-commands',
          option: TokenProcessorOptionTypes.ZERO_OR_ONE,
        },
      ],
    ],
  },
  'drawto-commands': {
    options: ['drawto-command', ['drawto-command', { value: 'wsp', option: TokenProcessorOptionTypes.ZERO_OR_MORE }, 'drawto-commands']],
  },
  'drawto-command': {
    options: [
      'closepath',
      'lineto',
      'horizontal-lineto',
      'vertical-lineto',
      'curveto',
      'smooth-curveto',
      'quadratic-bezier-curveto',
      'smooth-quadratic-bezier-curveto',
      'elliptical-arc',
    ],
  },
  moveto: {
    options: [[/[m]/i, { value: 'wsp', option: TokenProcessorOptionTypes.ZERO_OR_MORE }, 'moveto-argument-sequence']],
  },
  'moveto-argument-sequence': {
    options: [
      'coordinate-pair',
      [
        'coordinate-pair',
        {
          value: 'comma-wsp',
          option: TokenProcessorOptionTypes.ZERO_OR_ONE,
        },
        'lineto-argument-sequence',
      ],
    ],
  },
  closepath: {
    options: [/[z]/i],
  },
  lineto: {
    options: [[/[l]/i, { value: 'wsp', option: TokenProcessorOptionTypes.ZERO_OR_MORE }, 'lineto-argument-sequence']],
  },
  'lineto-argument-sequence': {
    options: [
      'coordinate-pair',
      [
        'coordinate-pair',
        {
          value: 'comma-wsp',
          option: TokenProcessorOptionTypes.ZERO_OR_ONE,
        },
        'lineto-argument-sequence',
      ],
    ],
  },
  'horizontal-lineto': {
    options: [
      [
        /[h]/i,
        {
          value: 'wsp',
          option: TokenProcessorOptionTypes.ZERO_OR_MORE,
        },
        'horizontal-lineto-argument-sequence',
      ],
    ],
  },
  'horizontal-lineto-argument-sequence': {
    options: [
      'coordinate',
      [
        'coordinate',
        {
          value: 'comma-wsp',
          option: TokenProcessorOptionTypes.ZERO_OR_ONE,
        },
        'horizontal-lineto-argument-sequence',
      ],
    ],
  },
  'vertical-lineto': {
    options: [
      [
        /[v]/i,
        {
          value: 'wsp',
          option: TokenProcessorOptionTypes.ZERO_OR_MORE,
        },
        'vertical-lineto-argument-sequence',
      ],
    ],
  },
  'vertical-lineto-argument-sequence': {
    options: [
      'coordinate',
      [
        'coordinate',
        {
          value: 'comma-wsp',
          option: TokenProcessorOptionTypes.ZERO_OR_ONE,
        },
        'vertical-lineto-argument-sequence',
      ],
    ],
  },
  curveto: {
    options: [[/[c]/i, { value: 'wsp', option: TokenProcessorOptionTypes.ZERO_OR_MORE }, 'curveto-argument-sequence']],
  },
  'curveto-argument-sequence': {
    options: [
      'curveto-argument',
      [
        'curveto-argument',
        {
          value: 'comma-wsp',
          option: TokenProcessorOptionTypes.ZERO_OR_ONE,
        },
        'curveto-argument-sequence',
      ],
    ],
  },
  'curveto-argument': {
    options: [
      [
        'coordinate-pair',
        {
          value: 'comma-wsp',
          option: TokenProcessorOptionTypes.ZERO_OR_ONE,
        },
        'coordinate-pair',
        {
          value: 'comma-wsp',
          option: TokenProcessorOptionTypes.ZERO_OR_ONE,
        },
        'coordinate-pair',
      ],
    ],
  },
  'smooth-curveto': {
    options: [
      [
        /[s]/i,
        {
          value: 'wsp',
          option: TokenProcessorOptionTypes.ZERO_OR_MORE,
        },
        'smooth-curveto-argument-sequence',
      ],
    ],
  },
  'smooth-curveto-argument-sequence': {
    options: [
      'smooth-curveto-argument',
      [
        'smooth-curveto-argument',
        {
          value: 'comma-wsp',
          option: TokenProcessorOptionTypes.ZERO_OR_ONE,
        },
        'smooth-curveto-argument-sequence',
      ],
    ],
  },
  'smooth-curveto-argument': {
    options: [['coordinate-pair', { value: 'comma-wsp', option: TokenProcessorOptionTypes.ZERO_OR_ONE }, 'coordinate-pair']],
  },
  'quadratic-bezier-curveto': {
    options: [
      [
        /[q]/i,
        {
          value: 'wsp',
          option: TokenProcessorOptionTypes.ZERO_OR_MORE,
        },
        'quadratic-bezier-curveto-argument-sequence',
      ],
    ],
  },
  'quadratic-bezier-curveto-argument-sequence': {
    options: [
      'quadratic-bezier-curveto-argument',
      [
        'quadratic-bezier-curveto-argument',
        { value: 'comma-wsp', option: TokenProcessorOptionTypes.ZERO_OR_ONE },
        'quadratic-bezier-curveto-argument-sequence',
      ],
    ],
  },
  'quadratic-bezier-curveto-argument': {
    options: [['coordinate-pair', { value: 'comma-wsp', option: TokenProcessorOptionTypes.ZERO_OR_ONE }, 'coordinate-pair']],
  },
  'smooth-quadratic-bezier-curveto': {
    options: [
      [
        /[t]/i,
        {
          value: 'wsp',
          option: TokenProcessorOptionTypes.ZERO_OR_MORE,
        },
        'smooth-quadratic-bezier-curveto-argument-sequence',
      ],
    ],
  },
  'smooth-quadratic-bezier-curveto-argument-sequence': {
    options: [
      'coordinate-pair',
      [
        'coordinate-pair',
        {
          value: 'comma-wsp',
          option: TokenProcessorOptionTypes.ZERO_OR_ONE,
        },
        'smooth-quadratic-bezier-curveto-argument-sequence',
      ],
    ],
  },
  'elliptical-arc': {
    options: [
      [
        /[a]/i,
        {
          value: 'wsp',
          option: TokenProcessorOptionTypes.ZERO_OR_MORE,
        },
        'elliptical-arc-argument-sequence',
      ],
    ],
  },
  'elliptical-arc-argument-sequence': {
    options: [
      'elliptical-arc-argument',
      [
        'elliptical-arc-argument',
        {
          value: 'comma-wsp',
          option: TokenProcessorOptionTypes.ZERO_OR_ONE,
        },
        'elliptical-arc-argument-sequence',
      ],
    ],
  },
  'elliptical-arc-argument': {
    options: [
      [
        'nonnegative-number',
        {
          value: 'comma-wsp',
          option: TokenProcessorOptionTypes.ZERO_OR_ONE,
        },
        'nonnegative-number',
        { value: 'comma-wsp', option: TokenProcessorOptionTypes.ZERO_OR_ONE },
        'number',
        'comma-wsp',
        'flag',
        {
          value: 'comma-wsp',
          option: TokenProcessorOptionTypes.ZERO_OR_ONE,
        },
        'flag',
        { value: 'comma-wsp', option: TokenProcessorOptionTypes.ZERO_OR_ONE },
        'coordinate-pair',
      ],
    ],
  },
  'coordinate-pair': {
    options: [['coordinate', { value: 'comma-wsp', option: TokenProcessorOptionTypes.ZERO_OR_ONE }, 'coordinate']],
  },
  coordinate: {
    options: ['number'],
  },
  'nonnegative-number': {
    options: ['integer-constant', 'floating-point-constant'],
  },
  number: {
    options: [
      [{ value: 'sign', option: TokenProcessorOptionTypes.ZERO_OR_ONE }, 'integer-constant'],
      [{ value: 'sign', option: TokenProcessorOptionTypes.ZERO_OR_ONE }, 'floating-point-constant'],
    ],
  },
  flag: {
    options: [/[01]/],
  },
  'comma-wsp': {
    options: [
      [
        { value: 'wsp', option: TokenProcessorOptionTypes.ONE_OR_MORE },
        {
          value: 'comma',
          option: TokenProcessorOptionTypes.ZERO_OR_ONE,
        },
        { value: 'wsp', option: TokenProcessorOptionTypes.ZERO_OR_MORE },
      ],
      ['comma', { value: 'wsp', option: TokenProcessorOptionTypes.ZERO_OR_MORE }],
    ],
  },
  comma: {
    options: [/[,]/],
  },
  'integer-constant': {
    options: ['digit-sequence'],
  },
  'floating-point-constant': {
    options: [
      ['fractional-constant', { value: 'exponent', option: TokenProcessorOptionTypes.ZERO_OR_ONE }],
      ['digit-sequence', 'exponent'],
    ],
  },
  'fractional-constant': {
    options: [
      [{ value: 'digit-sequence', option: TokenProcessorOptionTypes.ZERO_OR_ONE }, /[.]/, 'digit-sequence'],
      ['digit-sequence', /[.]/],
    ],
  },
  exponent: {
    options: [[/[e]/i, { value: 'sign', option: TokenProcessorOptionTypes.ZERO_OR_ONE }, 'digit-sequence']],
  },
  sign: {
    options: [/[+-]/],
  },
  'digit-sequence': {
    options: ['digit', ['digit', 'digit-sequence']],
  },
  digit: {
    options: [/[0-9]/],
  },
  wsp: { options: [/ /, /\t/, /\n/] },
};

export const SVGPathDGrammar: Grammar<SVGPathDTokenTypes> = {
  entry: 'svg-path',
  map: SVGPathDGrammarMap,
};

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
  // wsp: () => '',
  // comma: () => '',
  // one_or_more_white_space: () => '',
  // divider: () => '',
  // command: ({ value }) => getTypedSVGPathDCommand({ command: value as SVGPathDCommandTypes, coordinates: [] }),
  // command_value_set_group: ({ transformedValue: [{ command }, ...coordinates] = [] }) =>
  //   getTypedSVGPathDCommand({
  //     command,
  //     coordinates: flattenAndClean(coordinates).map((c: string) => parseFloat(c)),
  //   }),
  // input: ({ transformedValue }) => flattenAndClean(transformedValue),
  // operator: ({ value }) => value,
  // decimal: ({ value }) => value,
  // digit: ({ value }) => value,
  // digit_set: ({ transformedValue = [] }) => transformedValue.join(''),
  // value: ({ transformedValue = [] }) => transformedValue.join(''),
  // value_set: ({ transformedValue = [] }) => transformedValue,
};

getTypedSVGPathDCommand({ command: 'A', coordinates: [] });
