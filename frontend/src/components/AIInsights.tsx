import React from 'react';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { BudgetInsight, BudgetRecommendation } from '../services/aiBudgetingService';

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

const InsightItem = styled.View<{ severity: string }>`
  margin-bottom: 16px;
  padding: 16px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border-left-width: 4px;
  border-left-color: ${props => 
    props.severity === 'high' ? '#ff6b6b' : 
    props.severity === 'medium' ? '#ffd43b' : 
    '#51cf66'
  };
`;

const InsightHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

const InsightIcon = styled(Ionicons)<{ severity: string }>`
  color: ${props => 
    props.severity === 'high' ? '#ff6b6b' : 
    props.severity === 'medium' ? '#ffd43b' : 
    '#51cf66'
  };
  margin-right: 12px;
`;

const InsightTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  flex: 1;
`;

const InsightDescription = styled.Text`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 20px;
`;

const RecommendationItem = styled.View`
  margin-bottom: 16px;
  padding: 16px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const RecommendationHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const RecommendationCategory = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
`;

const PriorityBadge = styled.View<{ priority: string }>`
  padding: 4px 8px;
  border-radius: 8px;
  background-color: ${props => 
    props.priority === 'high' ? 'rgba(255, 107, 107, 0.2)' : 
    props.priority === 'medium' ? 'rgba(255, 212, 59, 0.2)' : 
    'rgba(81, 207, 102, 0.2)'
  };
`;

const PriorityText = styled.Text<{ priority: string }>`
  font-size: 12px;
  font-weight: 600;
  color: ${props => 
    props.priority === 'high' ? '#ff6b6b' : 
    props.priority === 'medium' ? '#ffd43b' : 
    '#51cf66'
  };
  text-transform: uppercase;
`;

const BudgetComparison = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const BudgetItem = styled.View`
  align-items: center;
`;

const BudgetValue = styled.Text`
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
`;

const BudgetLabel = styled.Text`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
`;

const Reasoning = styled.Text`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  font-style: italic;
`;

interface AIInsightsProps {
  insights: BudgetInsight[];
  recommendations: BudgetRecommendation[];
}

export const AIInsights: React.FC<AIInsightsProps> = ({ insights, recommendations }) => {
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'spending_pattern':
        return 'analytics';
      case 'category_alert':
        return 'warning';
      case 'budget_recommendation':
        return 'calculator';
      case 'savings_opportunity':
        return 'trending-up';
      default:
        return 'bulb';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Container>
      <Title>AI Insights & Recommendations</Title>
      
      {insights.map((insight, index) => (
        <InsightItem key={index} severity={insight.severity}>
          <InsightHeader>
            <InsightIcon 
              name={getInsightIcon(insight.type) as any} 
              size={20} 
              severity={insight.severity} 
            />
            <InsightTitle>{insight.title}</InsightTitle>
          </InsightHeader>
          <InsightDescription>{insight.description}</InsightDescription>
        </InsightItem>
      ))}
      
      {recommendations.length > 0 && (
        <>
          <Title style={{ marginTop: 24 }}>Budget Recommendations</Title>
          
          {recommendations.map((recommendation, index) => (
            <RecommendationItem key={index}>
              <RecommendationHeader>
                <RecommendationCategory>{recommendation.category}</RecommendationCategory>
                <PriorityBadge priority={recommendation.priority}>
                  <PriorityText priority={recommendation.priority}>
                    {recommendation.priority}
                  </PriorityText>
                </PriorityBadge>
              </RecommendationHeader>
              
              <BudgetComparison>
                <BudgetItem>
                  <BudgetValue style={{ color: '#ff6b6b' }}>
                    {formatCurrency(recommendation.currentSpending)}
                  </BudgetValue>
                  <BudgetLabel>Current</BudgetLabel>
                </BudgetItem>
                
                <BudgetItem>
                  <BudgetValue style={{ color: '#51cf66' }}>
                    {formatCurrency(recommendation.recommendedBudget)}
                  </BudgetValue>
                  <BudgetLabel>Recommended</BudgetLabel>
                </BudgetItem>
              </BudgetComparison>
              
              <Reasoning>{recommendation.reasoning}</Reasoning>
            </RecommendationItem>
          ))}
        </>
      )}
    </Container>
  );
}; 