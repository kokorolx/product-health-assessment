import { useState, useEffect, useCallback } from 'react';

// Score range filter options
const SCORE_FILTERS = [
  "Score: High (80-100)",
  "Score: Medium (60-79)",
  "Score: Low (0-59)",
];

interface FilterBarProps {
  availableFilters: string[];
  activeFilters: string[];
  onFilterClick: (filter: string) => void;
  onClearFilters: () => void;
}

const FilterBar = ({
  availableFilters,
  activeFilters,
  onFilterClick,
  onClearFilters,
}: FilterBarProps) => {
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  // Handle escape key press
  const handleEscapeKey = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setOpenGroup(null);
    }
  }, []);

  // Handle click outside
  const handleClickOutside = useCallback((event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest('.filter-group')) {
      setOpenGroup(null);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleEscapeKey);
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [handleEscapeKey, handleClickOutside]);

  // Group filters by their prefix (e.g., "Category:", "Suitable for:")
  const groupedFilters = [...availableFilters, ...SCORE_FILTERS].reduce((acc, filter) => {
    const [prefix] = filter.split(":");
    if (!prefix) return acc;

    const group = prefix.trim();
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(filter);
    return acc;
  }, {} as Record<string, string[]>);

  // Helper to check if a filter is a score filter
  const isScoreFilter = (filter: string) => filter.startsWith("Score:");

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex flex-wrap gap-3 flex-grow">
          {Object.entries(groupedFilters).map(([group, filters]) => (
            <div key={group} className="relative inline-block filter-group">
              <button
                className={`px-4 py-2 text-sm font-semibold rounded-lg
                  bg-white border border-gray-200
                  transition-all duration-200 ease-in-out
                  flex items-center gap-2
                  ${openGroup === group ? 'bg-gray-50' : 'hover:bg-gray-50'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenGroup(openGroup === group ? null : group);
                }}
                aria-haspopup="true"
                aria-expanded={openGroup === group}
              >
                {group}
                {group === "Score" && (
                  <svg
                    className="w-4 h-4 text-gray-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
                  </svg>
                )}
                <svg
                  className={`w-4 h-4 transition-transform duration-200
                    ${openGroup === group ? 'transform rotate-180 text-gray-700' : 'text-gray-500'}`}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M19 9l-7 7-7-7"></path>
                </svg>
                {filters.some(f => activeFilters.includes(f)) && (
                  <span className="w-2 h-2 rounded-full bg-blue-500 absolute top-1 right-1" />
                )}
              </button>
              <div className={`absolute z-10 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-1 w-48
                ${openGroup === group ? 'block' : 'hidden'}`}>
                {filters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => onFilterClick(filter)}
                    className={`
                      w-full px-4 py-2 text-sm text-left
                      transition-colors duration-150
                      flex items-center justify-between
                      ${isScoreFilter(filter) ? 'font-medium' : ''}
                      ${
                        activeFilters.includes(filter)
                          ? 'bg-blue-50 text-blue-700 font-semibold'
                          : 'text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    <span>{filter.split(":")[1]?.trim()}</span>
                    {activeFilters.includes(filter) && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        {activeFilters.length > 0 && (
          <button
            onClick={onClearFilters}
            className="px-4 py-2 rounded-lg text-sm font-semibold
              bg-white text-red-600 hover:text-white
              border-2 border-red-200 hover:border-red-600
              hover:bg-red-600
              transition-all duration-200 ease-in-out
              flex items-center gap-2
              whitespace-nowrap"
            aria-label="Clear all active filters"
          >
            <span>Clear All</span>
            <span className="text-xs">({activeFilters.length})</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;