"use client";

import { useState, useMemo } from 'react';

// Score range filter options - these might be replaced by a slider later
const SCORE_FILTERS = [
  "Score: High (80-100)",
  "Score: Medium (60-79)",
  "Score: Low (0-59)",
];

interface ProductFilterSidebarProps {
  availableCategories: string[];
  availableSuitableFor: string[];
  activeFilters: string[];
  onFilterClick: (filter: string) => void;
  onClearFilters: () => void;
  isCollapsed: boolean; // New prop
  onToggleCollapse: () => void; // New prop
  // Will add props for score range later if using a slider
}

// Helper to convert to Title Case
const toTitleCase = (str: string) => {
  return str
    .toLowerCase()
    .split(/[\s_]+/) // Split by space or underscore
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const ProductFilterSidebar = ({
  availableCategories,
  availableSuitableFor,
  activeFilters,
  onFilterClick,
  onClearFilters,
  isCollapsed,
  onToggleCollapse,
}: ProductFilterSidebarProps) => {
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleGroup = (group: string) => {
    setOpenGroup(openGroup === group ? null : group);
  };

  const baseFilterGroups = useMemo(() => [
    {
      name: "Category",
      options: availableCategories.map(cat => ({ rawValue: `category:${cat}`, displayValue: toTitleCase(cat) })),
    },
    {
      name: "Suitable For",
      options: availableSuitableFor.map(sf => ({ rawValue: `suitable_for:${sf}`, displayValue: toTitleCase(sf) })),
    },
    {
      name: "Health Score",
      options: SCORE_FILTERS.map(sf => ({ rawValue: sf, displayValue: sf.replace('Score: ', '') })),
    }
  ], [availableCategories, availableSuitableFor]);

  const filteredGroups = useMemo(() => {
    if (!searchTerm.trim()) {
      return baseFilterGroups;
    }
    return baseFilterGroups.map(group => ({
      ...group,
      options: group.options.filter(option =>
        option.displayValue.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    })).filter(group => group.options.length > 0);
  }, [baseFilterGroups, searchTerm]);

  return (
    <div
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-slate-900 text-slate-200 flex flex-col transition-all duration-300 ease-in-out z-40 ${isCollapsed ? 'w-16' : 'w-72'}`}
    >
      <div className={`flex flex-col h-full ${isCollapsed ? 'items-center' : ''}`}>
        <div className="p-4 shrink-0">
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} mb-4`}>
            {!isCollapsed && <h3 className="text-xl font-semibold text-slate-100">Filters</h3>}
            <button
              onClick={onToggleCollapse}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded-md"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {!isCollapsed && (
          <div className="flex flex-col h-full px-4 pb-4">
            <input
              type="text"
              placeholder="Search filters... (⌘ K)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 mb-4 bg-slate-800 text-slate-200 rounded-md border border-slate-700 focus:ring-blue-500 focus:border-blue-500 placeholder-slate-500 shrink-0"
            />
            <div className="flex-grow overflow-y-auto min-h-0 space-y-4 pr-1 pb-16 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800">
              {filteredGroups.length > 0 ? filteredGroups.map((group) => (
                <div key={group.name} className="w-full">
                  <button
                    onClick={() => toggleGroup(group.name)}
                    className="flex items-center justify-between w-full py-2 text-left hover:bg-slate-700 px-2 rounded transition-colors duration-150"
                  >
                    <span className="font-medium text-slate-300">{group.name}</span>
                    <span className="text-slate-400">{openGroup === group.name || searchTerm ? '▲' : '▼'}</span>
                  </button>
                  {(openGroup === group.name || searchTerm) && group.options.length > 0 && (
                    <div className="pt-2 pl-3 space-y-1">
                      {group.options.map((option) => (
                        <label key={option.rawValue} className="flex items-center space-x-2 cursor-pointer hover:bg-slate-700 px-2 py-1 rounded group">
                          <input
                            type="checkbox"
                            className="form-checkbox h-4 w-4 text-blue-500 bg-slate-700 border-slate-600 rounded focus:ring-blue-500 focus:ring-offset-slate-900"
                            checked={activeFilters.includes(option.rawValue)}
                            onChange={() => onFilterClick(option.rawValue)}
                          />
                          <span className="text-slate-300 group-hover:text-slate-100">{option.displayValue}</span>
                        </label>
                      ))}
                    </div>
                  )}
                  {searchTerm && group.options.length === 0 && (
                    <div className="pt-2 pl-3 text-sm text-slate-500">No matching options in this group.</div>
                  )}
                </div>
              )) : (
                <div className="text-slate-500 text-sm text-center py-4">
                  No filters match your search.
                </div>
              )}
            </div>
            {activeFilters.length > 0 && (
              <button
                onClick={() => {
                  onClearFilters();
                  setSearchTerm('');
                }}
                className="w-full px-4 py-2 mt-4 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shrink-0"
              >
                Clear All Filters ({activeFilters.length})
              </button>
            )}
          </div>
        )}

        {isCollapsed && (
          <div className="p-4 flex flex-col items-center space-y-4">
            <button className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded-md" aria-label="Search">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>
            {activeFilters.length > 0 && (
              <button
                onClick={() => {
                  onClearFilters();
                  setSearchTerm('');
                }}
                className="p-2 text-white bg-red-600 hover:bg-red-700 rounded-md"
                aria-label={`Clear ${activeFilters.length} filters`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.56 0c1.131.094 2.262.26 3.379.497m0 0L7.105 19.673A2.25 2.25 0 009.35 21.75h5.3c2.117 0 3.995-1.802 3.995-4.034 0-1.17-.486-2.227-1.273-2.993L10.5 9.621m7.932-3.83c-.094-.69-.355-1.336-.764-1.89M9.35 21.75h5.3c.941 0 1.793-.349 2.457-.908M15.85 5.79V4.034c0-.92-.701-1.676-1.606-1.796M9.35 21.75v-1.093c0-.92.701-1.676 1.606-1.796" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductFilterSidebar;
