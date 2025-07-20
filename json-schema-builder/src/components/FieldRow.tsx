// src/components/FieldRow.tsx
import React from 'react';
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import type { SchemaField } from '../types/schema';
import { MinusCircle, PlusCircle } from 'lucide-react'; // Example icons, install lucide-react if needed
import { v4 as uuidv4 } from 'uuid'; // For unique IDs, install uuid if needed

interface FieldRowProps {
  field: SchemaField;
  index: number;
  // This 'path' is important for nested forms to correctly reference the field in RHF
  parentPath: string;
  onDelete: (index: number) => void;
}

const FieldRow: React.FC<FieldRowProps> = ({ index, parentPath, onDelete }) => {
  const { control, watch } = useFormContext();
  const currentFieldType = watch(`${parentPath}.${index}.type`);

  // For nested fields, we need a separate useFieldArray for children
  const { fields: nestedFields, append: appendNested, remove: removeNested } = useFieldArray({
    control,
    name: `${parentPath}.${index}.children`, // Path to the children array
  });

  const handleAddField = () => {
    appendNested({
      id: uuidv4(),
      name: `newField${nestedFields.length + 1}`,
      type: 'string',
    });
  };

  const handleDeleteNestedField = (nestedIndex: number) => {
    removeNested(nestedIndex);
  };

  return (
    <div className="border p-4 mb-4 rounded-md bg-gray-50">
      <div className="flex items-center space-x-2 mb-2">
        <Controller
          name={`${parentPath}.${index}.name`}
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder="Field Name" className="w-48" />
          )}
        />

        <Controller
          name={`${parentPath}.${index}.type`}
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="string">String</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="nested">Nested</SelectItem>
              </SelectContent>
            </Select>
          )}
        />

        {currentFieldType !== 'nested' && (
          <Controller
            name={`${parentPath}.${index}.value`}
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type={currentFieldType === 'number' ? 'number' : 'text'}
                placeholder="Default Value"
                className="flex-grow"
              />
            )}
          />
        )}

        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(index)}
        >
          <MinusCircle className="h-4 w-4" />
        </Button>
      </div>

      {currentFieldType === 'nested' && (
        <div className="ml-8 border-l-2 pl-4 pt-2">
          <p className="font-semibold mb-2">Nested Fields:</p>
          {nestedFields.map((nestedField, nestedIndex) => (
            <FieldRow
              key={nestedField.id}
              field={nestedField as SchemaField} // Cast to SchemaField
              index={nestedIndex}
              parentPath={`${parentPath}.${index}.children`}
              onDelete={handleDeleteNestedField}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddField}
            className="mt-2"
          >
            <PlusCircle className="h-4 w-4 mr-2" /> Add Nested Field
          </Button>
        </div>
      )}
    </div>
  );
};

export default FieldRow;