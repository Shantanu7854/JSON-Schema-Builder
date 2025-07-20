import React from 'react';
import { Textarea } from './ui/textarea';

interface JsonPreviewProps {
  jsonString: string;
}

const JsonPreview: React.FC<JsonPreviewProps> = ({ jsonString }) => {
  return (

    <div className="relative w-full">
      <h3 className="text-lg font-medium mb-2">Generated JSON</h3>
      <Textarea className="w-full h-64 font-mono text-sm p-2 bg-gray-100 dark:bg-gray-800 dark:text-white"
        value={jsonString}
        readOnly
      />
    </div>
    
  );
};

export default JsonPreview;
