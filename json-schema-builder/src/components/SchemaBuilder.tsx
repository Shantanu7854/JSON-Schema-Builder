import React, { useState, useEffect } from 'react';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import { Button } from './ui/button';
import type { SchemaField, Schema } from '../types/schema';
import FieldRow from './FieldRow';
import JsonPreview from './JsonPreview';
import { v4 as uuidv4 } from 'uuid';

interface SchemaBuilderProps { }

const SchemaBuilder: React.FC<SchemaBuilderProps> = () => {
  const methods = useForm<{ fields: SchemaField[] }>({
    defaultValues: {
      fields: [],
    },
    mode: 'onChange',
  });
  const { control, watch, handleSubmit, getValues } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'fields',
  });

  const [jsonOutput, setJsonOutput] = useState<string>('');

  const buildJsonSchema = (schemaFields: SchemaField[]): Schema => {
    const jsonSchema: Schema = {};
    schemaFields.forEach(field => {
      if (field.type === 'nested' && field.children) {
        jsonSchema[field.name] = buildJsonSchema(field.children);
      } else if (field.type === 'string' || field.type === 'number') {
        jsonSchema[field.name] = field.value !== undefined && field.value !== null
          ? field.value
          : (field.type === 'string' ? '' : 0);
      }
    });
    return jsonSchema;
  };

  const allFields = watch('fields');
  useEffect(() => {
    try {
      const currentSchema = getValues('fields');
      const generatedJson = buildJsonSchema(currentSchema);
      setJsonOutput(JSON.stringify(generatedJson, null, 2));
    } catch (error) {
      console.error("Error generating JSON:", error);
      setJsonOutput("Error generating JSON: " + (error as Error).message);
    }
  }, [allFields, getValues]);

  const handleAddField = () => {
    append({
      id: uuidv4(),
      name: `field${fields.length + 1}`,
      type: 'string',
      value: '',
    });
  };

  const handleDeleteField = (index: number) => {
    remove(index);
  };

  const onSubmit = (data: { fields: SchemaField[] }) => {
    console.log("Form Data Submitted:", data);
    const finalJson = buildJsonSchema(data.fields);
    console.log("Final JSON Schema:", finalJson);
    alert("Check console for form data and generated JSON!");
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-xl"
      >

        {/* Added bg, shadow, and rounded corners */}

        {/* Left Column */}
        <div className="space-y-6">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white text-center md:text-left mb-6">JSON Schema Builder</h1> {/* Enhanced title style */}

          <div className="space-y-4 min-h-[400px]"> {/* Added min-height for consistent layout */}
            {fields.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-10">
                No fields added yet. Click "+ Add Item" to start building your schema!
              </p>
            )}
            {fields.map((field, index) => (
              <FieldRow
                key={field.id}
                field={field as SchemaField}
                index={index}
                parentPath="fields"
                onDelete={handleDeleteField}
              />
            ))}
          </div>

          <div className="flex flex-col gap-3 pt-4 border-t border-gray-200 dark:border-gray-700"> {/* Added top border for separation */}
            <Button
              type="button"
              onClick={handleAddField}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              + Add Item
            </Button>
            <Button
              type="submit"
              className="w-full bg-indigo-700 hover:bg-indigo-800 text-white py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              Generate JSON Schema
            </Button>
          </div>
        </div>

        {/* Right Column */}
        <div className="h-full flex flex-col"> {/* Added flex-col for better layout of json preview */}
          <JsonPreview jsonString={jsonOutput} />
        </div>
      </form>
    </FormProvider>
  );
};

export default SchemaBuilder;