// src/components/SchemaBuilder.tsx
import React, { useState, useEffect } from 'react';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import type { SchemaField, Schema } from '../types/schema';
import FieldRow from './FieldRow';
import JsonPreview from './JsonPreview'; // Import the new JsonPreview component
import { PlusCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface SchemaBuilderProps {}

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

  // Function to recursively build the JSON schema
  const buildJsonSchema = (schemaFields: SchemaField[]): Schema => {
    const jsonSchema: Schema = {};
    schemaFields.forEach(field => {
      if (field.type === 'nested' && field.children) {
        jsonSchema[field.name] = buildJsonSchema(field.children);
      } else if (field.type === 'string' || field.type === 'number') {
        // Provide default values if 'value' is undefined or null
        jsonSchema[field.name] = field.value !== undefined && field.value !== null
          ? field.value
          : (field.type === 'string' ? '' : 0);
      }
    });
    return jsonSchema;
  };

  // Watch for changes in the form fields and update JSON output
  const allFields = watch('fields');
  useEffect(() => {
    try {
      const currentSchema = getValues('fields');
      const generatedJson = buildJsonSchema(currentSchema);
      setJsonOutput(JSON.stringify(generatedJson, null, 2));
    } catch (error) {
      console.error("Error generating JSON:", error);
      setJsonOutput("Error generating JSON: " + (error as Error).message); // More descriptive error
    }
  }, [allFields, getValues]);

  const handleAddField = () => {
    append({
      id: uuidv4(),
      name: `field${fields.length + 1}`,
      type: 'string',
      value: '', // Default value for new string field
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
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">JSON Schema Builder</h1>

        <Tabs defaultValue="builder" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="builder">Schema Builder</TabsTrigger>
            <TabsTrigger value="json">JSON Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="builder" className="mt-4">
            <div className="space-y-4">
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
            <Button type="button" onClick={handleAddField} className="mt-4 w-full">
              <PlusCircle className="h-4 w-4 mr-2" /> Add Field
            </Button>
            <Button type="submit" className="mt-4 w-full bg-green-600 hover:bg-green-700">
              Generate Schema
            </Button>
          </TabsContent>
          <TabsContent value="json" className="mt-4">
            {/* Use the JsonPreview component here */}
            <JsonPreview jsonString={jsonOutput} />
          </TabsContent>
        </Tabs>
      </form>
    </FormProvider>
  );
};

export default SchemaBuilder;