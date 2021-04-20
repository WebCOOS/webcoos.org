import React from 'react';
import { getSiteMetadata } from '../utils';
import Page from '../components/Page';

export default function FourOhFour({ metadata }) {
    return (
        <Page metadata={metadata} title='Page Not Found'>
            <div className='container mx-auto px-4 py-24 text-center'>
                <div className='text-6xl mb-8'>404</div>
                <div>
                    The page you're looking for could not be found.{' '}
                    {metadata.helpEmail && (
                        <>
                            If you need further assistance please contact{' '}
                            <a href={`mailto:${metadata.helpEmail}`}>{metadata.helpEmail}</a>
                        </>
                    )}
                </div>
            </div>
        </Page>
    );
}

export async function getStaticProps() {
    return {
        props: {
            metadata: await getSiteMetadata(),
        },
    };
}
