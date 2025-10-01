import type { ReactElement } from "react"
import Page from "@Components/Page"
import SectionHeader from "@Components/Section/SectionHeader"
import Section from "@Components/Section/Section"
import { Loader } from "@axdspub/axiom-ui-utilities"

const Feedback = (): ReactElement => {
    const feedbackURL = import.meta.env.VITE_PUBLIC_FEEDBACK_URL
    if(feedbackURL === undefined) {
        throw new Error("Feedback URL is not defined")
    }
    return (
            <Page>

            <Section shaded={false}>
                <SectionHeader>Feedback</SectionHeader>
                <p className='text-sm'>
                    Please let us know if you are experiencing an issue with
                    WebCOOS, or if there are improvements you would like to see.

                    We look forward to your feedback.
                </p>
                <div className='relative max-w-128 -mx-[35px]'>
                <Loader className='mx-auto h-8 w-8 absolute top-16 left-1/2' />

                <iframe
                    className='w-full h-128 absolute top-0'
                    src={feedbackURL}
                ></iframe>
                </div>
            </Section>
        </Page>
    )
}

export default Feedback