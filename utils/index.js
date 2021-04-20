import { readFile } from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';

const SITE_METADATA = 'site.yaml';

export async function getYaml(fileName) {
    const fileContent = await readFile(path.join(process.cwd(), fileName));
    return yaml.load(fileContent);
}

export function getSiteMetadata() {
    return getYaml(SITE_METADATA);
}
