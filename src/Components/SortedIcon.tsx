import type { ReactElement } from "react";


export type SortDirection = "asc" | "desc" | "none";

interface SortedIconBaseProps {
    direction?: SortDirection;
    activeColor?: string;
    inactiveColor?: string;
}

export const SortedIconBase = ({ direction = "none", activeColor = '#FFF', inactiveColor = '#CCCCCC99' }: SortedIconBaseProps): ReactElement => {

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3 h-3 ml-1"
            aria-hidden="true"
            fill="none"
            viewBox="0 0 320 512"
        >
            {/* Up Arrow */}
            <path
                d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224z"
                fill={direction === "asc" ? activeColor : inactiveColor}
            />
            {/* Down Arrow */}
            <path
                d="M292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z"
                fill={direction === "desc" ? activeColor : inactiveColor}
            />
        </svg>
    );
};


export const SortedIcon = (props: SortedIconBaseProps): ReactElement => {
    return (
        <SortedIconBase {...props} />
    );
};
