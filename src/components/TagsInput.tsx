'use client';

import { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface TagsInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  normalize?: (value: string) => string;
}

export default function TagsInput({
  value,
  onChange,
  placeholder = 'Add items...',
  normalize,
}: TagsInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && inputValue === '' && value.length > 0) {
      removeTag(value.length - 1);
    }
  };

  const addTag = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !value.includes(trimmedValue)) {
      const normalizedValue = normalize ? normalize(trimmedValue) : trimmedValue;
      if (normalizedValue) {
        onChange([...value, normalizedValue]);
      }
    }
    setInputValue('');
  };

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border border-input rounded-md bg-background">
        {value.map((tag, index) => (
          <Badge key={index} variant="secondary" className="flex items-center gap-1">
            {tag}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-auto p-0 ml-1 hover:bg-transparent"
              onClick={() => removeTag(index)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
      {inputValue && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addTag}
          className="text-xs"
        >
          Add "{inputValue}"
        </Button>
      )}
    </div>
  );
}
