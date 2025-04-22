import React from 'react';

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const TextArea: React.FC<TextAreaProps> = (props) => (
  <textarea
    {...props}
    style={{
      padding: 8,
      borderRadius: 4,
      border: '1px solid #ccc',
      resize: 'vertical',
      ...props.style
    }}
  />
);

export default TextArea;
