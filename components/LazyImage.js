/**
 * Adapted from https://hangindev.com/blog/create-a-lazy-loading-image-component-with-react-hooks
 */

import React, { useEffect, useState, useRef, useMemo } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const imgStyle = "absolute w-full h-full inset-0 object-cover object-center"

export default function LazyImage({ className, styles={}, src, alt, lqip, aspectRatio = 2 / 3, onClick=null}) {
    const [loaded, setLoaded] = useState(false);
    const imgRef = useRef();
    useEffect(() => {
        if (imgRef.current && imgRef.current.complete) {
            setLoaded(true);
        }
    }, []);
    const lqipData = useMemo(() => {
        if (lqip && !lqip.startsWith('data:')) {
            return `data:image/png;base64,${lqip}`;
        }
        return lqip;
    }, [lqip]);
    return (
        <div className={classNames('relative overflow-hidden', className)} style={styles}>
            {/* <div style={{ paddingBottom: `${100 / aspectRatio}%` }} /> */}
            <img src={lqipData} aria-hidden='true' className={classNames(imgStyle)} onClick={onClick} />
            <img
                loading='lazy'
                className={classNames(imgStyle, 'transition-opacity duration-1000', {
                    'opacity-100': loaded,
                    'opacity-0': !loaded,
                })}
                src={src}
                alt={alt}
                ref={imgRef}
                onLoad={() => setLoaded(true)}
                onClick={onClick}
            />
        </div>
    );
}

LazyImage.propTypes = {
  className: PropTypes.string,
  src: PropTypes.string,
  alt: PropTypes.string,
  lqip: PropTypes.string,
  aspectRatio: PropTypes.number
};