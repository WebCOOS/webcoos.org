import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import { parse } from "yaml"


export type MarkdownParams = {
    markdownFile: string,
    signal?: AbortSignal
}

export type IMarkdownContent = {
    frontMatter?: IFrontMatter,
    content: string
}

export type IFrontMatter = {
    title?: string,
    classes?: string,
    show_product_grid?: boolean
}

export const useMarkdown = (params: MarkdownParams): UseQueryResult<IMarkdownContent> => {
    const queryResult = useQuery({
        queryKey: [JSON.stringify(params)],
        queryFn: async ({ signal }): Promise<IMarkdownContent> => {
            const str = await(await fetch(params.markdownFile, { signal })).text()
            const regex = /^---\r?\n(?<frontMatter>[\s\S]*?)\r?\n---/m;

            const match = str.match(regex);
            const frontMatterString = match?.groups?.frontMatter;
            const content = match?.[0] 
                ? str.substring(match[0].length).trim() 
                : str;
            
            const frontMatter: IFrontMatter | undefined = frontMatterString ? parse(frontMatterString) : undefined;

            
            
            return {
                frontMatter,
                content
            }
        }
    })

    return queryResult
}
