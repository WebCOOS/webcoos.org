import React from 'react';
import Page from '../components/Page';
import path from 'path';
import recursive from 'recursive-readdir';
import { readFile } from 'fs/promises';
import matter from 'gray-matter';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import { getYaml, getSiteMetadata } from '../utils';
import ProductCard from '../components/ProductCard';
import 'katex/dist/katex.min.css'
import classNames from 'classnames';
import { Section } from '@axdspub/landing-page-components';

export default function MarkdownPage({ products, content, data, metadata }) {

    return (
        <Page metadata={metadata} title={data.title}>
            <Section>
                <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeRaw, rehypeKatex]}
                    className={classNames('prose p-4 pb-12', data.classes)}
                >
                    {content}
                </ReactMarkdown>
            </Section>

            {data.show_product_grid && (
                <Section className="-mt-24">
                    <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
                        {products.sections.products.map((p) => {
                            return <ProductCard key={p.slug} {...p} />;
                        })}
                    </div>
                </Section>
            )}

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
            products: await getYaml('products.yaml'),
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
