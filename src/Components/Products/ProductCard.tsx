import type { Product } from '@/types/yaml/products';
import { utils } from '@axdspub/axiom-ui-utilities';
import { Link } from 'react-router';

export default function ProductCard({
    label,
    image,
    content,
    slug,
    extraClasses = ''
}: Product) {

  const location = window.location.pathname;
  let link = `/products/${slug}`;
  let isActive = slug && location.search(slug) !== -1;
  if (isActive === true) {
    extraClasses += ' active-product bg-[var(--color-primary-lighter)]';
  }

  return (
      <div
        className={
            utils.makeClassName({
                defaultClassName: 'max-w-sm bg-white rounded border border-[var(--color-primary-lighter)] shadow-sm flex flex-row gap-2 px-2',
                className: extraClasses
            })
        }
      >
          <Link to={link} className="self-top flex-none hidden md:block">
              <img className='rounded-t w-16 pt-4' src={image} alt='' />
          </Link>
          <div className='flex-grow flex flex-col gap-1 pt-4'>
              <Link to={link} className={
                utils.makeClassName({
                    defaultClassName: 'text-[var(--color-primary)] hover:text-[var(--color-primary-darker)]',
                })

                }>
                  <h5 className='mb-2 text-2xl font-bold tracking-tight'>
                      {label}
                  </h5>
              </Link>
              <p className='mb-3 font-normal text-gray-700 flex-grow'>{content}</p>
              {slug && (
                  <Link
                      to={link}
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
                  </Link>
              )}
          </div>
      </div>
  );
}
