import React from 'react';
import { ProductivityStatsView } from '../components/analytics/ProductivityStatsView';

export const AnalyticsPage: React.FC = () => {
  return (
    <div className="max-w-md lg:max-w-2xl mx-auto space-y-6 animate-in fade-in duration-150">
      <ProductivityStatsView />
    </div>
  );
};
