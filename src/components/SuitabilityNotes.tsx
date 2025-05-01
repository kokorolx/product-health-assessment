import React from 'react';

const warningKeywords = [
  "không phù hợp",
  "không nên",
  "nguy cơ"
];

const cautionKeywords = [
  "hạn chế",
  "cẩn thận",
  "ưu tiên nấu chín"
];

interface SuitabilityNotesProps {
  notes: Record<string, string>;
}

const getColorClasses = (value: string): string => {
  const lowerValue = value.toLowerCase();

  if (warningKeywords.some(keyword => lowerValue.includes(keyword))) {
    return 'border-red-500 bg-red-50';
  }
  if (cautionKeywords.some(keyword => lowerValue.includes(keyword))) {
    return 'border-yellow-500 bg-yellow-50';
  }
  return 'border-gray-300 bg-gray-50';
};

const formatKey = (key: string): string => {
  // Convert snake_case or camelCase to Title Case
  return key
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Handle camelCase
    .replace(/_/g, ' ') // Handle snake_case
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const SuitabilityNotes: React.FC<SuitabilityNotesProps> = ({ notes }) => {
  return (
    <div className="space-y-4">
      {Object.entries(notes)
        .filter(([, value]) => value) // Only show notes that have content
        .map(([key, value]) => (
          <div
            key={key}
            className={`p-4 rounded-lg border ${getColorClasses(value)} shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">
                {formatKey(key)}
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                {value}
              </p>
            </div>
          </div>
        ))}
    </div>
  );
};

export default SuitabilityNotes;