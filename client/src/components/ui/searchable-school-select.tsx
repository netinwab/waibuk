import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getFlagByCountryName } from '@/lib/countries';

interface School {
  id: string;
  name: string;
  country?: string;
}

interface SearchableSchoolSelectProps {
  schools: School[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchableSchoolSelect({
  schools,
  value,
  onValueChange,
  placeholder = "Search for a school...",
  className
}: SearchableSchoolSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedSchool = schools.find(school => school.id === value);

  const filteredSchools = schools.filter(school =>
    school.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper function to get flag for a school
  const getSchoolFlag = (school: School) => {
    return school.country ? getFlagByCountryName(school.country) : "🏴";
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredSchools.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredSchools.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredSchools[highlightedIndex]) {
          onValueChange(filteredSchools[highlightedIndex].id);
          setIsOpen(false);
          setSearchTerm('');
          setHighlightedIndex(-1);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleSchoolSelect = (schoolId: string) => {
    onValueChange(schoolId);
    setIsOpen(false);
    setSearchTerm('');
    setHighlightedIndex(-1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setHighlightedIndex(-1);
  };

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const highlightedItem = listRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedItem) {
        highlightedItem.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        });
      }
    }
  }, [highlightedIndex]);

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <div
        className={cn(
          "flex items-center justify-between w-full px-3 py-2 text-sm bg-white/10 backdrop-blur-lg border border-white/20 rounded-md cursor-pointer transition-colors shadow-lg",
          "hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30",
          isOpen && "border-white/30 ring-2 ring-white/30"
        )}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          {selectedSchool ? (
            <>
              <span className="text-lg">{getSchoolFlag(selectedSchool)}</span>
              <span className="truncate text-white">{selectedSchool.name}</span>
            </>
          ) : (
            <span className="text-white/70">{placeholder}</span>
          )}
        </div>
        <ChevronDown className={cn(
          "h-4 w-4 text-white/70 transition-transform",
          isOpen && "rotate-180"
        )} />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-blue-600/100 backdrop-blur-lg border border-white/20 rounded-md shadow-2xl max-h-60 overflow-hidden">
          <div className="p-2 border-b border-white/20">
            <div className="relative bg-white/10">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white" />
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Type to search schools..."
                className="w-full pl-8 pr-3 py-2 text-sm bg-blue-400/60 backdrop-blur-lg border border-white/20 rounded text-white placeholder:text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30"
              />
            </div>
          </div>

          <ul
            ref={listRef}
            className="py-1 overflow-y-auto max-h-48"
            role="listbox"
          >
            {filteredSchools.length > 0 ? (
              filteredSchools.map((school, index) => (
                <li
                  key={school.id}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 text-sm cursor-pointer transition-colors text-white",
                    "hover:bg-white/20",
                    highlightedIndex === index && "bg-white/30",
                    value === school.id && "bg-white/40"
                  )}
                  onClick={() => handleSchoolSelect(school.id)}
                  role="option"
                  aria-selected={value === school.id}
                >
                  <span className="text-lg">{getSchoolFlag(school)}</span>
                  <span className="flex-1 truncate text-white">{school.name}</span>
                  {value === school.id && (
                    <Check className="h-4 w-4 text-green-500" />
                  )}
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-sm text-white text-center">
                No schools found
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}