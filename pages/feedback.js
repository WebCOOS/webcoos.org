import { Section, SectionHeader } from '@axdspub/landing-page-components';
import { useEffect, useState } from 'react';
import Page from '../components/Page';
import { getSiteMetadata } from '../utils';

export default function Home({ metadata }) {

    const [feedbackURL, setFeedbackURL] = useState( process.env.NEXT_PUBLIC_FEEDBACK_URL || '#' );

    useEffect( () => {
        // Attempt to set up the feedback URL with the ref of the current page
        if( feedbackURL && feedbackURL !== '#' ) {

            try {

                // Attempt URL parsing
                const parsed_url = new URL( feedbackURL );

                const the_ref = parsed_url.searchParams.get( 'ref' );

                // If not already set, and the window is available, update the
                // feedbackURL state to be the href with the ref set to the
                // current window.location.href
                if( !the_ref && typeof window !== 'undefined' ) {
                    parsed_url.searchParams.set(
                        'ref',
                        window.location.href
                    )

                    setFeedbackURL( parsed_url.href );
                }

            } catch( error ) {
                console.warn(
                    'Problem occurred parsing and appending ref to window.location.href',
                    error
                )
            }
        }
    } );

    return (
        <Page metadata={metadata}>

            <Section shaded={false}>
                <SectionHeader>Feedback</SectionHeader>
                <p className='text-sm'>
                    Please let us know if you are experiencing an issue with
                    WebCOOS, or if there are improvements you would like to see.

                    We look forward to your feedback.
                </p>

                <iframe
                    className='w-full h-128'
                    src={feedbackURL}
                ></iframe>
            </Section>
        </Page>
    );
}

export async function getStaticProps() {
    return {
        props: {
            metadata: await getSiteMetadata()
        },
    };
}
