import React from 'react';
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { X, Plus } from 'lucide-react';
import type { SchemaField } from '../types/schema';
import { v4 as uuidv4 } from 'uuid';

interface FieldRowProps {
  field: SchemaField;
  index: number;
  parentPath: string;
  onDelete: (index: number) => void;
}

const FieldRow: React.FC<FieldRowProps> = ({ index, parentPath, onDelete }) => {
  const { control, watch } = useFormContext();
  const type = watch(`${parentPath}.${index}.type`);

  const { fields: nested, append, remove } = useFieldArray({
    control,
    name: `${parentPath}.${index}.children`,
  });


  
  return (
    <div className="p-3 border rounded space-y-2">
      <div className="flex gap-2 items-center">
        <Controller
          name={`${parentPath}.${index}.name`}
          control={control}
          render={({ field }) => <Input {...field} placeholder="Name" className="flex-1" />}
        />

        <Controller
          name={`${parentPath}.${index}.type`}
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-28"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="string">String</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="nested">Nested</SelectItem>
              </SelectContent>
            </Select>
          )}
        />

        {type !== 'nested' && (
          <Controller
            name={`${parentPath}.${index}.value`}
            control={control}
            render={({ field }) => (
              <Input {...field} type={type === 'number' ? 'number' : 'text'} placeholder="Value" className="w-28" />
            )}
          />
        )}
        <Button type="button" size="icon" onClick={() => onDelete(index)} variant="ghost">
          <X />
        </Button>
      </div>
      {type === 'nested' && (
        <div className="ml-4 space-y-2">
          {nested.map((nf, ni) => (
            <FieldRow
              key={nf.id}
              field={nf as SchemaField}
              index={ni}
              parentPath={`${parentPath}.${index}.children`}
              onDelete={remove}
            />
          ))}
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => append({ id: uuidv4(), name: '', type: 'string' })}
          >
            <Plus className="w-4 h-4 mr-1" /> Add Nested
          </Button>
        </div>
      )}
    </div>
  );
};

export default FieldRow;
