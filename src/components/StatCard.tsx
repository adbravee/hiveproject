import React from 'react';
import { Tooltip } from 'react-tooltip';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  change?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, change }) => {
  const formatValue = (val: number | string) => {
    if (typeof val === 'number') {
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md transition-transform hover:scale-105">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-semibold">{formatValue(value)}</p>
          {change !== undefined && (
            <p 
              className={`text-sm mt-2 ${
                change > 0 ? 'text-green-500' : change < 0 ? 'text-red-500' : 'text-gray-500'
              }`}
              data-tooltip-id={`tooltip-${title}`}
            >
              {change > 0 ? '↑' : change < 0 ? '↓' : '→'} {Math.abs(change)}%
            </p>
          )}
          <Tooltip id={`tooltip-${title}`} content={`Change in the last period`} />
        </div>
        <div className="text-blue-500">{icon}</div>
      </div>
    </div>
  );
};

export default StatCard;