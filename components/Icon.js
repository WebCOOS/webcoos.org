import React, { useState, useMemo, useEffect } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export const IconBase = ({
    path,
    path2,
    extraClasses = '',
    size = 6,
    onClick,
    enabled = true,
    paddingx = 2,
    tooltip,
}) => {
    return (
        <div
            className={classNames('cursor-pointer', `px-${paddingx}`, extraClasses, {
                'text-gray-400 cursor-not-allowed': !enabled,
                'has-tooltip': tooltip,
            })}
            onClick={(e) => {
                if (!enabled || !onClick) {
                    return;
                }
                e.stopPropagation();
                onClick();
            }}
        >
            {tooltip && enabled && <span className='tooltip'>{tooltip}</span>}
            <svg
                xmlns='http://www.w3.org/2000/svg'
                className={`h-${size} w-${size}`}
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
            >
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d={path} />

                {path2 && <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d={path2} />}
            </svg>
        </div>
    );
};

IconBase.propTypes = {
    path: PropTypes.string.isRequired,
    path2: PropTypes.string,
    extraClasses: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onClick: PropTypes.func,
    enabled: PropTypes.bool,
    paddingx: PropTypes.number,
    tooltip: PropTypes.string,
};

// https://heroicons.com/

export const IconCamera = (props) => {
    return (
        <IconBase
            path='M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z'
            path2='M15 13a3 3 0 11-6 0 3 3 0 016 0z'
            {...props}
        />
    );
};

export const IconVideoCamera = (props) => {
    return (
        <IconBase
            path='M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'
            {...props}
        />
    );
};

export const IconSignal = (props) => {
    return (
        <IconBase
            path='M9.348 14.651a3.75 3.75 0 010-5.303m5.304 0a3.75 3.75 0 010 5.303m-7.425 2.122a6.75 6.75 0 010-9.546m9.546 0a6.75 6.75 0 010 9.546M5.106 18.894c-3.808-3.808-3.808-9.98 0-13.789m13.788 0c3.808 3.808 3.808 9.981 0 13.79M12 12h.008v.007H12V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z'
            {...props}
        />
    );
}
