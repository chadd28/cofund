import React from 'react';
import styled from 'styled-components/native';
import { SpendingAnalytics } from '../services/aiBudgetingService';

const Container = styled.View`
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const Title = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 16px;
`;

const MetricsRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const MetricContainer = styled.View`
  flex: 1;
  align-items: center;
  padding: 12px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  margin: 0 4px;
`;

const MetricValue = styled.Text<{ color?: string }>`
  font-size: 18px;
  font-weight: 700;
  color: ${props => props.color || '#ffffff'};
  margin-bottom: 4px;
`;

const MetricLabel = styled.Text`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
`;

const SavingsRateContainer = styled.View`
  align-items: center;
  padding: 16px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
`;

const SavingsRateValue = styled.Text<{ rate: number }>`
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.rate >= 20 ? '#51cf66' : props.rate >= 10 ? '#ffd43b' : '#ff6b6b'};
  margin-bottom: 4px;
`;

const SavingsRateLabel = styled.Text`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
`;

interface SpendingOverviewProps {
  analytics: SpendingAnalytics;
}

export const SpendingOverview: React.FC<SpendingOverviewProps> = ({ analytics }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getSavingsColor = (rate: number) => {
    if (rate >= 20) return '#51cf66';
    if (rate >= 10) return '#ffd43b';
    return '#ff6b6b';
  };

  return (
    <Container>
      <Title>Spending Overview</Title>
      
      <MetricsRow>
        <MetricContainer>
          <MetricValue color="#ff6b6b">
            {formatCurrency(analytics.totalSpending)}
          </MetricValue>
          <MetricLabel>Total Spending</MetricLabel>
        </MetricContainer>
        
        <MetricContainer>
          <MetricValue color="#51cf66">
            {formatCurrency(analytics.totalIncome)}
          </MetricValue>
          <MetricLabel>Total Income</MetricLabel>
        </MetricContainer>
        
        <MetricContainer>
          <MetricValue color={analytics.netSavings >= 0 ? '#51cf66' : '#ff6b6b'}>
            {formatCurrency(analytics.netSavings)}
          </MetricValue>
          <MetricLabel>Net Savings</MetricLabel>
        </MetricContainer>
      </MetricsRow>
      
      <SavingsRateContainer>
        <SavingsRateValue rate={analytics.savingsRate}>
          {analytics.savingsRate.toFixed(1)}%
        </SavingsRateValue>
        <SavingsRateLabel>Savings Rate</SavingsRateLabel>
      </SavingsRateContainer>
    </Container>
  );
}; 