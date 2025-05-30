import React from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

type Props = {
  content: string;
};

const MarkdownRenderer: React.FC<Props> = ({ content }) => {
  const getSanitizedHtml = () => {
    const rawHtml = marked.parse(content, { breaks: true, gfm: true });
    return { __html: DOMPurify.sanitize(rawHtml) };
  };

  return <div dangerouslySetInnerHTML={getSanitizedHtml()} />;
};

export default MarkdownRenderer;
