export type BaseSVGPathDCommand<CommandTypes extends string, CoordinatesType> = {
  command: CommandTypes;
  coordinates: CoordinatesType[];
};

export type MoveToCommand = BaseSVGPathDCommand<
  'M' | 'm',
  {
    x: number;
    y: number;
  }
>;

export type ClosePathCommand = BaseSVGPathDCommand<'Z' | 'z', never>;

export type LineToCommand = BaseSVGPathDCommand<
  'L' | 'l',
  {
    x: number;
    y: number;
  }
>;

export type HorizontalLineToCommand = BaseSVGPathDCommand<
  'H' | 'h',
  {
    x: number;
  }
>;

export type VerticalLineToCommand = BaseSVGPathDCommand<
  'V' | 'v',
  {
    y: number;
  }
>;

export type CurveToCommand = BaseSVGPathDCommand<
  'C' | 'c',
  {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    x: number;
    y: number;
  }
>;

export type SmoothCurveToCommand = BaseSVGPathDCommand<
  'S' | 's',
  {
    x2: number;
    y2: number;
    x: number;
    y: number;
  }
>;

export type QuadraticBezierCurveToCommand = BaseSVGPathDCommand<
  'Q' | 'q',
  {
    x1: number;
    y1: number;
    x: number;
    y: number;
  }
>;

export type SmoothQuadraticBezierCurveToCommand = BaseSVGPathDCommand<
  'T' | 't',
  {
    x: number;
    y: number;
  }
>;

export type EllipticalArcCommand = BaseSVGPathDCommand<
  'A' | 'a',
  {
    rx: number;
    ry: number;
    xAxisRotation: number;
    largeArcFlag: number;
    sweepFlag: number;
    x: number;
    y: number;
  }
>;

export type SVGPathDCommand =
  | MoveToCommand
  | ClosePathCommand
  | LineToCommand
  | HorizontalLineToCommand
  | VerticalLineToCommand
  | CurveToCommand
  | SmoothCurveToCommand
  | QuadraticBezierCurveToCommand
  | SmoothQuadraticBezierCurveToCommand
  | EllipticalArcCommand;
