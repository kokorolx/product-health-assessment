interface HealthScoreIndicatorProps {
  score: number;
}

const HealthScoreIndicator: React.FC<HealthScoreIndicatorProps> = ({ score }) => {
  // Ensure score is within valid range
  const validScore = Math.max(0, Math.min(100, score));

  // Determine color based on score range
  const getColorClass = (score: number) => {
    if (score <= 30) return 'bg-red-500';
    if (score <= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="inline-flex items-center">
      <div
        className={`
          ${getColorClass(validScore)}
          text-white
          font-semibold
          rounded-full
          w-10
          h-10
          flex
          items-center
          justify-center
          text-sm
        `}
      >
        {validScore}
      </div>
    </div>
  );
};

export default HealthScoreIndicator;