import {  useContext, type ReactElement } from "react";
import { utils, ViewWithLoader } from "@axdspub/axiom-ui-utilities";
import { useMarkdown } from "@/services/yaml/hooks/useMarkdown";
import MarkdownContent from "@Components/MarkdownContent";
import SiteContext from "@/state/SiteContext";
import Section from "@Components/Section/Section";
import Products from "@Components/Products/Products";

function Markdown(
    {
        markdownFile,
        className
    }: {
        markdownFile: string,
        className?: string
    }
): ReactElement { 

    const { data, isLoading, error } = useMarkdown({ markdownFile })
    const site = useContext(SiteContext)

    return (
        <ViewWithLoader isLoading={isLoading} error={error} data={data}>
            {data && <>
            {data?.frontMatter?.title && <title>{`${data.frontMatter.title}${site?.site?.title && ` | ${site.site.title}`}`}</title>}
            <Section>
            <MarkdownContent className={utils.makeClassName({
                className: data.frontMatter?.classes,
                defaultClassName: className
            })}>
                {data.content}
            </MarkdownContent>
                        </Section>
            {data.frontMatter?.show_product_grid &&

                <Products />
            
            }

            </>}
        </ViewWithLoader>
    )

    
}

export default Markdown