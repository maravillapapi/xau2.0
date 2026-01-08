import React from 'react';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import type { Forecast } from '../../types';

interface ForecastCardProps {
    forecast: Forecast;
}

export const ForecastCard: React.FC<ForecastCardProps> = ({ forecast }) => {
    const percentage = (forecast.actual / forecast.planned) * 100;
    const isNegative = forecast.variance < 0;
    const isPositiveMetric = ['Marge Brute', 'Production'].some(m => forecast.metric.includes(m));
    const varianceIsGood = isPositiveMetric ? !isNegative : isNegative;

    return (
        <Card className="p-4">
            <h4 className="text-xs font-semibold text-txt-secondary uppercase tracking-wide mb-3">
                {forecast.metric}
            </h4>

            <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-txt-tertiary">Prévu</span>
                <span className="text-sm font-medium text-txt-primary">
                    {forecast.unit === '$' || forecast.unit === '$/kg'
                        ? `${forecast.unit}${forecast.planned.toLocaleString()}`
                        : `${forecast.planned}${forecast.unit}`
                    }
                </span>
            </div>

            <ProgressBar
                value={forecast.actual}
                max={forecast.planned}
                showPercentage={false}
                size="md"
                color={forecast.status === 'critical' ? 'red' : forecast.status === 'warning' ? 'orange' : 'green'}
            />

            <div className="flex justify-between items-center mt-2">
                <span className="text-sm font-bold text-txt-primary">
                    {forecast.unit === '$' || forecast.unit === '$/kg'
                        ? `${forecast.unit}${forecast.actual.toLocaleString()}`
                        : `${forecast.actual}${forecast.unit}`
                    }
                </span>
                <span className={`
          text-xs font-medium
          ${varianceIsGood ? 'text-green-600' : 'text-red-600'}
        `}>
                    Écart: {isNegative ? '' : '+'}{forecast.variance.toFixed(1)}%
                    {isNegative ? ' ↓' : ' ↑'}
                </span>
            </div>
        </Card>
    );
};

export default ForecastCard;
