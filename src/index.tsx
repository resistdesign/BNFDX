import React, { FC, HTMLAttributes } from 'react';

export type PathCommand = {
  command: string;
  coords: number[];
  length: number;
};

export const parsePathD = (d = ''): PathCommand[] =>
  d
    .replace(/\n/gm, ' ')
    .replace(/[a-z]/gim, (char) => ` :${char} `)
    .replace(/[+-]/gm, (char) => ` ${char}`)
    .replace(/,/gm, ' ')
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
        .reduce((acc, chars) => {
          const charList = chars.split('');
          const values: string[] = [];

          let currentValue = '',
            hadDec = false;

          for (const c of charList) {
            if (c === '+' || c === '-') {
              if (currentValue !== '') {
                values.push(currentValue);
              }

              currentValue = c;
              hadDec = false;
            } else if (c === '.' && hadDec) {
              values.push(currentValue);

              currentValue = c;
            } else if (c === '.') {
              currentValue += c;
              hadDec = true;
            } else {
              currentValue += c;
            }
          }

          if (currentValue !== '') {
            values.push(currentValue);
          }

          return [...acc, ...values];
        }, [] as string[])
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

export const pathCommandsToPathD = (pathCommands: PathCommand[] = []): string =>
  pathCommands.reduce((acc, { command, coords }) => [...acc, command, ...coords], [] as (string | number)[]).join(' ');

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
