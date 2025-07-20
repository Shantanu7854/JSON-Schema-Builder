import React, { useEffect, useState } from 'react';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import { Button } from './ui/button';
import FieldRow from './FieldRow';
import JsonPreview from './JsonPreview';
import { v4 as uuidv4 } from 'uuid';
import type { SchemaField, Schema } from '../types/schema';

const SchemaBuilder: React.FC = () => {
  const methods = useForm<{ fields: SchemaField[] }>({ defaultValues: { fields: [] } });
  const { control, watch, handleSubmit, getValues } = methods;
  const { fields, append, remove } = useFieldArray({ control, name: 'fields' });

  const [json, setJson] = useState('');

  const generateJson = (fields: SchemaField[]): Schema => {
    const result: Schema = {};
    fields.forEach(f => {
      if (f.type === 'nested' && f.children) {
        result[f.name] = generateJson(f.children);
      } else {
        result[f.name] = f.value ?? (f.type === 'number' ? 0 : '');
      }
    });
    return result;
  };

  useEffect(() => {
    const generated = generateJson(getValues('fields'));
    setJson(JSON.stringify(generated, null, 2));
  }, [watch('fields')]);

  const handleAdd = () => {
    append({ id: uuidv4(), name: '', type: 'string', value: '' });
  };

  const onSubmit = (data: { fields: SchemaField[] }) => {
    alert("JSON generated! Check console.");
    console.log("Form Data:", data);
    console.log("Generated JSON:", generateJson(data.fields));
  };

  return (
    <FormProvider {...methods}>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-4 max-w-7xl mx-auto flex flex-col lg:flex-row gap-6"
      >
        {/* Left Colun */}
        <div className="flex-1 space-y-4">
          <h2 className="text-2xl font-bold">JSON Schema Builder</h2>

          {fields.map((field, i) => (
            <FieldRow
              key={field.id}
              field={field}
              index={i}
              parentPath="fields"
              onDelete={remove}
            />
          ))}

          <div className="flex gap-2">
            <Button type="button" onClick={handleAdd} className="flex-1">
              + Add Field
            </Button>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-1/2">
          <JsonPreview jsonString={json} />
          <div className="max-w-4xl mx-auto mb-6 p-4 border rounded-md bg-gray-50 dark:bg-gray-800 dark:text-white">
            <h3 className="text-xl font-semibold mb-2">How to Use</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Click <strong>+ Add Field</strong> to add a new field to your schema.</li>
              <li>Enter a <strong>name</strong>, choose a <strong>type</strong>, and optionally provide a <strong>value</strong>.</li>
              <li>Select <strong>"Nested"</strong> as type to add child fields inside the current field.</li>
            </ul>
          </div>

        </div>
      </form>

    </FormProvider>
  );
};

export default SchemaBuilder;
