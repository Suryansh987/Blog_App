import React, { memo } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

const MarkdownParser = (props) => {
  const { markdownValue } = props;

  return (
    <div>
      <Markdown
        remarkPlugins={remarkGfm}
        children={markdownValue}
        components={{
          // Customize the rendering of headers
          h1: ({ node, ...props }) => <h1 className='text-4xl font-bold my-3' {...props} />,
          h2: ({ node, ...props }) => <h2 className='text-3xl font-bold my-3' {...props} />,
          h3: ({ node, ...props }) => <h3 className='text-2xl font-bold my-3' {...props} />,
          h4: ({ node, ...props }) => <h4 className='text-xl font-bold my-3'  {...props} />,
          h5: ({ node, ...props }) => <h5 className='text-lg font-bold my-3'  {...props} />,
          h6: ({ node, ...props }) => <h6 className='text-base font-bold my-3' {...props} />,

          // Customize the rendering of links
          a: ({ node, ...props }) => <a target="_blank" className='text-blue-500 hover:underline underline-offset-8' {...props} />,

          // Customize the rendering of other elements as needed
          // For example, you can customize 'em' (italic) and 'strong' (bold) elements:
          em: ({ node, ...props }) => <em className='italic' {...props} />,
          strong: ({ node, ...props }) => <strong className='font-bold' {...props} />,
          code: ({ node, ...props }) => {
            // Check if the code is within a pre element
            if (props.className?.includes('language-')) {
              // If it is, apply syntax highlighting
              const { children, className, ...rest } = props;
              const language = className?.replace(/language-/, '');
              return (
                <SyntaxHighlighter language={language} style={dracula} PreTag="div" children={String(children).replace(/\n$/, '')} {...rest} />
              );
            } else {
              // Otherwise, render the code without syntax highlighting
              return <code className='bg-slate-200 p-1 rounded-md font-semibold' {...props} />;
            }
          },
          italic: ({ node, ...props }) => <i className="italic" {...props} />,
          ul: ({ node, ...props }) => <ul className='list-disc ml-4' {...props} />,
          ol: ({ node, ...props }) => <ol className='list-decimal ml-4' {...props} />,
          table: ({ node, ...props }) => <div className='overflow-x-auto'><table className="!text-center p-2 border-collapse border-2 border-gray-500 m-auto" {...props} /></div>,
          th: ({ node, ...props }) => <th className="!text-center p-2 border-2 border-gray-500" {...props} />,
          td: ({ node, ...props }) => <td className="!text-center p-2 border-2 border-gray-500" {...props} />,
          thead: ({ node, ...props }) => <thead className="!text-center p-2 border-2 border-gray-500" {...props} />,
          tbody: ({ node, ...props }) => <tbody className="!text-center p-2 border-2 border-gray-500" {...props} />,
        }}
      />
    </div>
  );
};

export default memo(MarkdownParser);

