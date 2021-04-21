import React from 'react';
import Page from '../components/Page';
import path from 'path';
import recursive from 'recursive-readdir';
import { readFile } from 'fs/promises';
import matter from 'gray-matter';
import ReactMarkdown from 'react-markdown';
import { getSiteMetadata } from '../utils';

export default function MarkdownPage({ content, data, metadata }) {
    return (
        <Page metadata={metadata} title={data.title}>
            <ReactMarkdown className='mx-auto prose p-4 pb-12'>{content}</ReactMarkdown>
        </Page>
    );
}

const MD_DIR = path.join(process.cwd(), 'md-content');

export async function getStaticProps({ params }) {
    const fileName = path.join(MD_DIR, params.md.join(path.sep) + '.md');
    const fileContent = await readFile(fileName, 'utf-8');
    const { data, content } = matter(fileContent);

    return {
        props: {
            metadata: await getSiteMetadata(),
            data,
            content,
        },
    };
}

export async function getStaticPaths() {
    let files
    try {
        files = await recursive(MD_DIR);
    } catch {
        files = []
    }
    const paths = files.map((file) => file.replace(MD_DIR, '').replace('.md', '').substring(1).split(path.sep));
    return {
        paths: paths.map((path) => ({
            params: {
                md: path,
            },
        })),
        fallback: false,
    };
}
