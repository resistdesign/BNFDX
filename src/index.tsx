import React, {FC, HTMLAttributes} from 'react';

export type R3DMPathProps = HTMLAttributes<SVGPathElement> & {};

export const R3DMPath: FC<R3DMPathProps> = ({
                                                ...props
                                            }) => {
    return <path {...props}/>;
};

export type R3DMGroupProps = HTMLAttributes<SVGGElement> & {};

export const R3DMGroup: FC<R3DMGroupProps> = ({children, ...props}) => {
    return <g {...props}>{children}</g>;
};

export type R3DMProps = HTMLAttributes<SVGElement> & {}

export const R3DM: FC<R3DMProps> = ({
                                        children,
                                        ...props
                                    }) => {
    return <svg {...props}>{children}</svg>;
};
