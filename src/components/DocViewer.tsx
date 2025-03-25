'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';

interface DocViewerProps {
  content: string;
}

const DocViewer: React.FC<DocViewerProps> = ({ content }) => {
  return (
    <div className="prose prose-slate max-w-none dark:prose-invert">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};

export default DocViewer; 