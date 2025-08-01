import React from 'react';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { SpendingCategory } from '../services/aiBudgetingService';

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

const CategoryItem = styled.View`
  margin-bottom: 16px;
  padding: 16px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const CategoryHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const CategoryName = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  flex: 1;
`;

const CategoryAmount = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #ff6b6b;
`;

const CategoryDetails = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const DetailItem = styled.View`
  align-items: center;
`;

const DetailValue = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
`;

const DetailLabel = styled.Text`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
`;

const TrendContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

const TrendIcon = styled(Ionicons)<{ trend: string }>`
  color: ${props => 
    props.trend === 'increasing' ? '#ff6b6b' : 
    props.trend === 'decreasing' ? '#51cf66' : 
    '#ffd43b'
  };
  margin-right: 8px;
`;

const TrendText = styled.Text<{ trend: string }>`
  font-size: 14px;
  color: ${props => 
    props.trend === 'increasing' ? '#ff6b6b' : 
    props.trend === 'decreasing' ? '#51cf66' : 
    '#ffd43b'
  };
  font-weight: 600;
  text-transform: capitalize;
`;

const Recommendation = styled.Text`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 20px;
  font-style: italic;
`;

const ProgressBar = styled.View`
  height: 4px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  margin-bottom: 8px;
`;

const ProgressFill = styled.View<{ percentage: number }>`
  height: 4px;
  background-color: #4A90E2;
  border-radius: 2px;
  width: ${props => Math.min(props.percentage, 100)}%;
`;

interface CategoryInsightsProps {
  categories: SpendingCategory[];
}

export const CategoryInsights: React.FC<CategoryInsightsProps> = ({ categories }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return 'trending-up';
      case 'decreasing':
        return 'trending-down';
      default:
        return 'remove';
    }
  };

  return (
    <Container>
      <Title>Spending by Category</Title>
      
      {categories.map((category, index) => (
        <CategoryItem key={index}>
          <CategoryHeader>
            <CategoryName>{category.category}</CategoryName>
            <CategoryAmount>{formatCurrency(category.total)}</CategoryAmount>
          </CategoryHeader>
          
          <ProgressBar>
            <ProgressFill percentage={category.percentage} />
          </ProgressBar>
          
          <CategoryDetails>
            <DetailItem>
              <DetailValue>{category.percentage.toFixed(1)}%</DetailValue>
              <DetailLabel>of total</DetailLabel>
            </DetailItem>
            
            <DetailItem>
              <DetailValue>{category.transactionCount}</DetailValue>
              <DetailLabel>transactions</DetailLabel>
            </DetailItem>
            
            <DetailItem>
              <DetailValue>{formatCurrency(category.averageAmount)}</DetailValue>
              <DetailLabel>average</DetailLabel>
            </DetailItem>
          </CategoryDetails>
          
          <TrendContainer>
            <TrendIcon 
              name={getTrendIcon(category.trend) as any} 
              size={16} 
              trend={category.trend} 
            />
            <TrendText trend={category.trend}>
              {category.trend} trend
            </TrendText>
          </TrendContainer>
          
          {category.recommendation && (
            <Recommendation>💡 {category.recommendation}</Recommendation>
          )}
        </CategoryItem>
      ))}
    </Container>
  );
}; 