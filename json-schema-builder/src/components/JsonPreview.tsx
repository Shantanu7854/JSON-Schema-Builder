import React from 'react';
import { Textarea } from './ui/textarea';

interface JsonPreviewProps {
  jsonString: string;
}

const JsonPreview: React.FC<JsonPreviewProps> = ({ jsonString }) => {
  return (
    <div className="json-preview-container relative h-full"> {/* Added relative and h-full for better positioning */}
      {/* Added a subtle header to indicate what this section is */}
      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">Generated JSON</h3>
      <Textarea
        className="min-h-[600px] font-mono bg-gray-800 text-green-300 p-4 rounded-md resize-none w-full shadow-lg overflow-auto custom-scrollbar" // Changed text color, added shadow and custom-scrollbar
        value={jsonString}
        readOnly
      />
      {/* Optional: Add a copy button */}
      <button
        onClick={() => navigator.clipboard.writeText(jsonString)}
        className="absolute top-4 right-4 bg-gray-700 text-white p-2 rounded-md hover:bg-gray-600 transition-colors duration-200"
        title="Copy JSON to clipboard"
      >
        Copy
      </button>
    </div>
  );
};

export default JsonPreview;