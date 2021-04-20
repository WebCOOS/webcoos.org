import path from 'path';
import { readFile, access } from 'fs/promises';
import Page from '../../components/Page';
import yaml from 'js-yaml';
import { SphinxDoc } from '@axds/landing-page-components';
import recursive from 'recursive-readdir';
import { getSiteMetadata } from '../../utils';

export default function DocPage({ data, metadata }) {
    return (
        <Page title={data.title} metadata={metadata}>
            <SphinxDoc data={data} />
        </Page>
    );
}

const DOCS_DIR = path.join(process.cwd(), 'docs');

export async function getStaticProps({ params }) {
    let fName;
    if (params.slug) {
        fName = path.join(DOCS_DIR, params.slug.join(path.sep) + '.fjson');
        try {
            await access(fName);
        } catch {
            fName = path.join(DOCS_DIR, params.slug.join(path.sep), 'index.fjson');
        }
    } else {
        fName = path.join(DOCS_DIR, 'index.fjson');
    }
    const content = await readFile(fName, 'utf-8');
    const data = JSON.parse(content);
    return {
        props: {
            metadata: await getSiteMetadata(),
            data,
        },
    };
}

export async function getStaticPaths() {
    let paths;
    try {
        const files = await recursive(DOCS_DIR);
        paths = files.map((file) =>
            file
                .replace(DOCS_DIR, '')
                .replace('.fjson', '')
                .substring(1)
                .split(path.sep)
                .filter((el) => el !== 'index')
        );
    } catch {
        paths = [];
    }
    return {
        paths: paths.map((path) => ({
            params: {
                slug: path,
            },
        })),
        fallback: false,
    };
}
