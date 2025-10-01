import type { HTMLProps, ReactNode } from "react";

export type SectionParams = HTMLProps<HTMLDivElement> & {
    shaded?: boolean;
    className?: string;
    children: React.ReactNode
 }



export type SectionHeaderParams = HTMLProps<HTMLHeadingElement> & {
    className?: string;
    children: ReactNode
};
