import React from 'react';
import styled from 'styled-components/native';
import Svg, { Path, G, Text as SvgText } from 'react-native-svg';
import { SpendingCategory } from '../services/aiBudgetingService';

const Container = styled.View`
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const Title = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 16px;
  text-align: center;
`;

const ChartContainer = styled.View`
  align-items: center;
  margin-bottom: 20px;
`;

const LegendContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const LegendItem = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
  width: 48%;
`;

const LegendColor = styled.View<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 6px;
  background-color: ${props => props.color};
  margin-right: 8px;
`;

const LegendText = styled.Text`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  flex: 1;
`;

const LegendAmount = styled.Text`
  font-size: 12px;
  font-weight: 600;
  color: #ffffff;
`;

interface SpendingPieChartProps {
  categories: SpendingCategory[];
  totalSpending: number;
}

// Color palette for the pie chart
const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
  '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
  '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA'
];

export const SpendingPieChart: React.FC<SpendingPieChartProps> = ({ 
  categories, 
  totalSpending 
}) => {
  const chartSize = 200;
  const radius = chartSize / 2;
  const center = chartSize / 2;

  // Calculate pie chart segments
  const createPieSegments = () => {
    let currentAngle = 0;
    const segments: Array<{
      path: string;
      color: string;
      category: string;
      percentage: number;
      amount: number;
    }> = [];

    categories.forEach((category, index) => {
      const percentage = category.percentage;
      const angle = (percentage / 100) * 360;
      const endAngle = currentAngle + angle;

      // Convert angles to radians
      const startRad = (currentAngle - 90) * (Math.PI / 180);
      const endRad = (endAngle - 90) * (Math.PI / 180);

      // Calculate arc points
      const x1 = center + radius * Math.cos(startRad);
      const y1 = center + radius * Math.sin(startRad);
      const x2 = center + radius * Math.cos(endRad);
      const y2 = center + radius * Math.sin(endRad);

      // Determine if arc is large (> 180 degrees)
      const largeArcFlag = angle > 180 ? 1 : 0;

      // Create SVG path
      const path = [
        `M ${center} ${center}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        'Z'
      ].join(' ');

      segments.push({
        path,
        color: COLORS[index % COLORS.length],
        category: category.category,
        percentage,
        amount: category.total
      });

      currentAngle = endAngle;
    });

    return segments;
  };

  const segments = createPieSegments();

  return (
    <Container>
      <Title>Spending by Category</Title>
      
      <ChartContainer>
        <Svg width={chartSize} height={chartSize}>
          <G>
            {segments.map((segment, index) => (
              <Path
                key={index}
                d={segment.path}
                fill={segment.color}
                stroke="#ffffff"
                strokeWidth="1"
              />
            ))}
            
            {/* Center text showing total */}
            <SvgText
              x={center}
              y={center - 10}
              fontSize="16"
              fontWeight="bold"
              fill="#ffffff"
              textAnchor="middle"
            >
              ${totalSpending.toLocaleString()}
            </SvgText>
            <SvgText
              x={center}
              y={center + 10}
              fontSize="12"
              fill="rgba(255, 255, 255, 0.7)"
              textAnchor="middle"
            >
              Total Spent
            </SvgText>
          </G>
        </Svg>
      </ChartContainer>

      <LegendContainer>
        {segments.map((segment, index) => (
          <LegendItem key={index}>
            <LegendColor color={segment.color} />
            <LegendText numberOfLines={1}>
              {segment.category}
            </LegendText>
            <LegendAmount>
              ${segment.amount.toLocaleString()}
            </LegendAmount>
          </LegendItem>
        ))}
      </LegendContainer>
    </Container>
  );
}; 