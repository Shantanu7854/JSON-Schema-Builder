// src/components/JsonPreview.tsx
import React from 'react';
import { Textarea } from './ui/textarea'; // Assuming ShadCN Textarea

interface JsonPreviewProps {
  jsonString: string;
}

const JsonPreview: React.FC<JsonPreviewProps> = ({ jsonString }) => {
  return (
    <div className="json-preview-container">
      <h2 className="text-xl font-semibold mb-2">Real-time JSON Preview</h2>
      <Textarea
        className="min-h-[400px] font-mono bg-gray-800 text-white p-4 rounded-md resize-none"
        value={jsonString}
        readOnly
      />
    </div>
  );
};

export default JsonPreview;