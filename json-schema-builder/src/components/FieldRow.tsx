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
import { X, Plus } from 'lucide-react'; // Imported Plus icon
import { v4 as uuidv4 } from 'uuid';

interface FieldRowProps {
  field: SchemaField;
  index: number;
  parentPath: string;
  onDelete: (index: number) => void;
}

const FieldRow: React.FC<FieldRowProps> = ({ field, index, parentPath, onDelete }) => {
  const { control, watch } = useFormContext();
  const currentFieldType = watch(`${parentPath}.${index}.type`);

  const {
    fields: nestedFields,
    append: appendNested,
    remove: removeNested,
  } = useFieldArray({
    control,
    name: `${parentPath}.${index}.children`,
  });

  const handleAddNestedField = () => {
    appendNested({
      id: uuidv4(),
      name: `nestedField${nestedFields.length + 1}`,
      type: 'string',
    });
  };

  const handleDeleteNestedField = (nestedIndex: number) => {
    removeNested(nestedIndex);
  };

  return (
    <div className="border border-gray-300 bg-white shadow-md rounded-lg p-4 space-y-3 dark:bg-gray-800 dark:border-gray-700 transition-all duration-200 ease-in-out hover:shadow-lg"> {/* Enhanced shadow and added transition */}
      <div className="flex flex-wrap items-center gap-4">
        <Controller
          name={`${parentPath}.${index}.name`}
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="Field Name" // More descriptive placeholder
              className="flex-1 min-w-[120px] border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600" // Enhanced input style
            />
          )}
        />

        <Controller
          name={`${parentPath}.${index}.type`}
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-[120px] border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"> {/* Enhanced select style */}
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-700 dark:text-white"> {/* Dark mode for select content */}
                <SelectItem value="string">String</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="nested">Nested Object</SelectItem> {/* More descriptive text */}
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
                placeholder="Default Value" // More descriptive placeholder
                className="flex-1 min-w-[120px] border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 text-right" // Enhanced input style
                // Add step for number input for better UX
                {...(currentFieldType === 'number' && { step: "any" })}
              />
            )}
          />
        )}

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onDelete(index)}
          className="text-gray-400 hover:text-red-500 transition-colors duration-200" // Enhanced delete button style
          title="Delete Field"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {currentFieldType === 'nested' && (
        <div className="ml-6 border-l-2 border-gray-200 pl-4 pt-2 space-y-4 dark:border-gray-600">
          <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">Nested Fields:</p> {/* Added a label for nested fields */}
          {nestedFields.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400 text-xs italic">
              No nested fields. Add one below.
            </p>
          )}
          {nestedFields.map((nestedField, nestedIndex) => (
            <FieldRow
              key={nestedField.id}
              field={nestedField as SchemaField}
              index={nestedIndex}
              parentPath={`${parentPath}.${index}.children`}
              onDelete={handleDeleteNestedField}
            />
          ))}
          <Button
            type="button"
            variant="outline" // Changed variant to outline for nested add button
            size="sm"
            onClick={handleAddNestedField}
            className="w-full border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-gray-700 transition duration-300 ease-in-out" // Enhanced style
          >
            <Plus className="h-4 w-4 mr-2" /> Add Nested Field
          </Button>
        </div>
      )}
    </div>
  );
};

export default FieldRow;