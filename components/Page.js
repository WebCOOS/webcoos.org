import React from 'react';
import { Body, Footer, Header, Page as LPage } from '@axds/landing-page-components';
import Head from 'next/head';

// Most of this could move to pages/_app.js if it could fetch its own
// static props. In the meantime we need the metadata passed in from
// each page. See: https://github.com/vercel/next.js/discussions/10949
function Page({ children, metadata, title }) {
    return (
        <LPage>
            <Head>
                <meta charSet='utf-8' />
                <meta name='viewport' content='width=device-width, initial-scale=1' />
                <title>
                    {title}
                    {title ? ' | ' : ''}
                    {metadata.site.title}
                </title>
                <meta httpEquiv='x-ua-compatible' content='ie=edge' />
                <link
                    href='https://api.tiles.mapbox.com/mapbox-gl-js/v2.8.2/mapbox-gl.css'
                    rel='stylesheet'
                />
                {metadata.site.description && <meta name='description' content={metadata.site.description} />}
            </Head>

            <Header {...metadata.header} />

            <Body>{children}</Body>

            <Footer {...metadata.footer} />
        </LPage>
    );
}

export default Page;
