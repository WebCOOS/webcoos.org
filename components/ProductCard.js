import React, { useMemo } from 'react';
import classNames from 'classnames';

export default function ProductCard({
    label,
    image,
    content,
    slug,
    extraClasses = '',
    ...props
}) {

  let link = `/products/${slug}`;
  let isActive = slug == props.active;
  if (isActive === true) {
    extraClasses += ' active-product'
  }

  return (
      <div
          className={classNames(
              'max-w-sm bg-white rounded border border-primary-lighter shadow-sm flex flex-row gap-2 px-2',
              extraClasses
          )}
      >
          <a href={link} className="self-top flex-none hidden md:block">
              <img className='rounded-t w-16 pt-4' src={image} alt='' />
          </a>
          <div className='flex-grow flex flex-col gap-1 pt-4'>
              <a href={link} className={classNames("text-primary", {"hover:text-primary-darker": !!slug})}>
                  <h5 className='mb-2 text-2xl font-bold tracking-tight'>
                      {label}
                  </h5>
              </a>
              <p className='mb-3 font-normal text-gray-700 flex-grow'>{content}</p>
              {slug && (
                  <a
                      href={link}
                      className='inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-primary rounded-sm hover:bg-primary-darker focus:ring-4 focus:outline-none focus:ring-primary-lighter'
                  >
                      Read more
                      <svg
                          className='ml-2 -mr-1 w-4 h-4'
                          fill='currentColor'
                          viewBox='0 0 20 20'
                          xmlns='http://www.w3.org/2000/svg'
                      >
                          <path
                              fillRule='evenodd'
                              d='M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z'
                              clipRule='evenodd'
                          ></path>
                      </svg>
                  </a>
              )}
          </div>
      </div>
  );
}
