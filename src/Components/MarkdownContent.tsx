import { utils } from "@axdspub/axiom-ui-utilities";
import Markdown from "react-markdown"
import { Link } from "react-router";
import rehypeRaw from 'rehype-raw';

const MarkdownContent = ({ 
  children,
  className,
  defaultClassName = 'prose pb-12'
}: { 
  children: string,
  className?: string,
  defaultClassName?: string
}) => {
    const md = <Markdown rehypePlugins={[rehypeRaw]} components={{
    a: ({ children, href }) => {
      const isExternal = href?.match(/^http/)
      if(href === undefined) {
        return <span>{children}</span>
      }
      return (
      <Link to={href} target={isExternal ? '_blank' : undefined} rel="noopener noreferrer" className="text-blue-500 hover:underline">{children}{isExternal ? '' : ''}</Link>
      )
    },
    ul: ({ children }) => <ul className="list-disc list-inside ml-0 pl-0 my-2">{children}</ul>,
  }}>{children}</Markdown>
  return <>
    {
      className !== undefined || defaultClassName !== undefined 
        ? <div className={utils.makeClassName({
          defaultClassName,
          className
        })}>{md}</div> 
        : md
    }  
  </>

}

export default MarkdownContent