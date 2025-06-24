import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { useRoutingContext } from '@/contexts/RoutingContext';
import { AutocompleteSuggestion } from '@/hooks/useRouting';
import { Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AutocompleteInputProps extends Omit<React.ComponentProps<typeof Input>, 'onChange'> {
  value: string;
  onValueChange: (value: string) => void;
  onSuggestionSelect: (suggestion: AutocompleteSuggestion) => void;
}

export const AutocompleteInput = ({ value, onValueChange, onSuggestionSelect, ...props }: AutocompleteInputProps) => {
  const { autocompleteSearch } = useRoutingContext();
  const [suggestions, setSuggestions] = useState<AutocompleteSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null); 

  const debounce = useCallback(
    (func: Function, delay: number) => {
      let timeoutId: NodeJS.Timeout;
      return (...args: any) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => { func(...args); }, delay);
      };
    },
    []
  );

  const fetchSuggestions = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    setIsLoading(true);
    const results = await autocompleteSearch(query);
    setSuggestions(results);
    setIsLoading(false);
  };

  const debouncedFetch = useCallback(debounce(fetchSuggestions, 300), []);

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
    inputRef.current?.focus(); 
  };

  const showSuggestions = isFocused && (suggestions.length > 0 || isLoading);

  return (
    <div className="relative w-full" ref={containerRef}>
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