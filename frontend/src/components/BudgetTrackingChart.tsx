import React from 'react';
import styled from 'styled-components/native';
import { SpendingCategory, BudgetRecommendation } from '../services/aiBudgetingService';

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

const OverallProgressContainer = styled.View`
  align-items: center;
  margin-bottom: 24px;
  padding: 16px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const OverallProgressText = styled.Text`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 8px;
`;

const OverallProgressAmount = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 12px;
`;

const ProgressBarContainer = styled.View`
  width: 100%;
  height: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressBar = styled.View<{ progress: number; color: string }>`
  height: 100%;
  width: ${props => Math.min(props.progress, 100)}%;
  background-color: ${props => props.color};
  border-radius: 4px;
`;

const ProgressText = styled.Text`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 8px;
  text-align: center;
`;



interface BudgetTrackingChartProps {
  categories: SpendingCategory[];
  recommendations: BudgetRecommendation[];
  totalSpending: number;
  totalBudget?: number;
}

const getProgressColor = (progress: number): string => {
  if (progress <= 80) return '#4ECDC4'; // Green - on track
  if (progress <= 100) return '#FFEAA7'; // Yellow - warning
  return '#FF6B6B'; // Red - over budget
};



export const BudgetTrackingChart: React.FC<BudgetTrackingChartProps> = ({
  categories,
  recommendations,
  totalSpending,
  totalBudget = 0
}) => {
  // Calculate total recommended budget
  const totalRecommendedBudget = recommendations.reduce((sum, rec) => sum + rec.recommendedBudget, 0);
  
  // Use total recommended budget if no total budget provided
  const effectiveTotalBudget = totalBudget || totalRecommendedBudget;
  
  // Calculate overall progress
  const overallProgress = effectiveTotalBudget > 0 ? (totalSpending / effectiveTotalBudget) * 100 : 0;
  
  return (
    <Container>
      <Title>Budget Tracking</Title>
      
      <OverallProgressContainer>
        <OverallProgressText>Overall Budget Progress</OverallProgressText>
        <OverallProgressAmount>
          ${totalSpending.toLocaleString()} / ${effectiveTotalBudget.toLocaleString()}
        </OverallProgressAmount>
        <ProgressBarContainer>
          <ProgressBar 
            progress={overallProgress} 
            color={getProgressColor(overallProgress)} 
          />
        </ProgressBarContainer>
        <ProgressText>
          {overallProgress.toFixed(1)}% of budget used
        </ProgressText>
      </OverallProgressContainer>
    </Container>
  );
}; 