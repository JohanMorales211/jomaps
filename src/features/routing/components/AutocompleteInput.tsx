import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AutocompleteSuggestion } from '../types';

interface AutocompleteInputProps extends Omit<React.ComponentProps<typeof Input>, 'value' | 'onChange'> {
  value: string;
  onValueChange: (value: string) => void;
  onSuggestionSelect: (suggestion: AutocompleteSuggestion) => void;
  fetchSuggestions: (query: string) => Promise<AutocompleteSuggestion[]>;
  onClear?: () => void;
}

export const AutocompleteInput: React.FC<AutocompleteInputProps> = ({ 
  value, 
  onValueChange, 
  onSuggestionSelect, 
  fetchSuggestions,
  onClear,
  ...props 
}) => {
  const [suggestions, setSuggestions] = useState<AutocompleteSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedFetch = useCallback(
    ((func: (query: string) => void, delay: number) => {
      let timeoutId: NodeJS.Timeout;
      return (query: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => { func(query); }, delay);
      };
    })(async (query) => {
      if (query.length < 3) {
        setSuggestions([]);
        return;
      }
      setIsLoading(true);
      const results = await fetchSuggestions(query);
      setSuggestions(results);
      setIsLoading(false);
    }, 300),
    [fetchSuggestions]
  );

  useEffect(() => {
    if (value && isFocused) {
      debouncedFetch(value);
    } else {
      setSuggestions([]);
    }
  }, [value, isFocused, debouncedFetch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => { document.removeEventListener("mousedown", handleClickOutside); };
  }, []);

  const handleSelect = (suggestion: AutocompleteSuggestion) => {
    onSuggestionSelect(suggestion);
    setSuggestions([]);
    setIsFocused(false);
  };
  
  const handleClear = () => {
    onValueChange('');
    onClear?.();
    inputRef.current?.focus();
  };

  const showSuggestions = isFocused && (suggestions.length > 0 || isLoading);

  return (
    <div className="relative w-full flex-grow" ref={containerRef}>
      <Input
        ref={inputRef}
        {...props}
        className={cn("pr-8", props.className)} 
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        autoComplete="off"
      />

      {value && !isLoading && (
        <button
          type="button"
          aria-label="Limpiar búsqueda"
          onClick={handleClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      
      {showSuggestions && (
        <div className="absolute top-full mt-2 w-full bg-card border shadow-lg rounded-md z-50 max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <ul>
              {suggestions.map((s, index) => (
                <li
                  key={`${s.lat}-${s.lng}-${index}`}
                  className="px-4 py-2 hover:bg-accent cursor-pointer text-sm"
                  onMouseDown={(e) => { e.preventDefault(); handleSelect(s); }}
                >
                  {s.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};