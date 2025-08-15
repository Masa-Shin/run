import React from 'react';
import {Text} from 'ink';
import TextInput from 'ink-text-input';

type SearchInputProps = {
  /** Current search query value */
  value: string;
  /** Callback when search query changes */
  onChange: (value: string) => void;
  /** Placeholder text for the input */
  placeholder?: string;
};

const sanitizeSearchQuery = (query: string): string => {
  if (!query || typeof query !== 'string') return '';

  return query.slice(0, 100).trim();
};

/**
 * Search input component for filtering scripts
 * Handles the search query input and display
 */
export default function SearchInput({
  value,
  onChange,
  placeholder = 'Type to filter...',
}: SearchInputProps) {
  const handleChange = (rawValue: string) => {
    const sanitized = sanitizeSearchQuery(rawValue);
    onChange(sanitized);
  };

  return (
    <>
      <Text bold color="cyan">
        Search scripts:{' '}
      </Text>
      <TextInput
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
      />
    </>
  );
}
