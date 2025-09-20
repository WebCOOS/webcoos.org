import Markdown from "react-markdown"

const MarkdownContent = ({ children }: { children: string }) => {
    return <Markdown components={{
    a: ({ children, href }) => {
      const isExternal = href?.match(/^http/)
      return (
      <a href={href} target={isExternal ? '_blank' : undefined} rel="noopener noreferrer" className="text-blue-500 hover:underline">{children}{isExternal ? '[nw]' : ''}</a>
      )
    },
    ul: ({ children }) => <ul className="list-disc list-inside ml-4 my-2">{children}</ul>,
  }}>{children}</Markdown>

}

export default MarkdownContent