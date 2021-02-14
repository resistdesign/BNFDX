import React, { FC, HTMLAttributes } from 'react';

export namespace React3DMicro {
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
}
