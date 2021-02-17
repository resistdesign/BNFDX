import React, { FC, HTMLAttributes } from 'react';

export type PathCommand = {
  command: string;
  coords: number[];
  length: number;
};

export const parsePathD = (d = ''): PathCommand[] =>
  d
    .replace(/[a-z]/gim, (char) => ` :${char} `)
    .replace(/[+-]/gim, (char) => ` ${char}`)
    .replace(/,/gim, ' ')
    .split(' ')
    .filter((chars) => chars !== '')
    .join(' ')
    .split(':')
    .filter((chars) => chars !== '')
    .reduce((acc, data): PathCommand[] => {
      const command = data.split('').filter((char) => /[a-z]/gim.test(char))[0];
      const coords = data
        .split(' ')
        .filter((chars, i) => !!chars && i > 0)
        .map((v) => parseFloat(v));
      const { length } = coords;

      return [
        ...acc,
        {
          command,
          coords,
          length,
        },
      ];
    }, [] as PathCommand[]);

export type PathProps = HTMLAttributes<SVGPathElement> & {};

export const Path: FC<PathProps> = ({ ...props }) => {
  return <path {...props} />;
};

export type GroupProps = HTMLAttributes<SVGGElement> & {};

export const Group: FC<GroupProps> = ({ children, ...props }) => {
  return <g {...props}>{children}</g>;
};

export type ViewProps = HTMLAttributes<SVGElement> & {};

export const View: FC<ViewProps> = ({ children, ...props }) => {
  return <svg {...props}>{children}</svg>;
};
