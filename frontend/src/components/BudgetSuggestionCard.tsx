import React from 'react';
import styled from 'styled-components/native';
import { ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AIBudgetSuggestion, BudgetCategory, BudgetGoal } from '../services/aiBudgetCreationService';

const Container = styled.View`
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const HeaderLeft = styled.View`
  flex: 1;
`;

const TemplateName = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 4px;
`;

const TemplateDescription = styled.Text`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 20px;
`;

const ConfidenceBadge = styled.View<{ confidence: number }>`
  padding: 6px 12px;
  border-radius: 12px;
  background-color: ${props => 
    props.confidence >= 0.8 ? 'rgba(81, 207, 102, 0.2)' :
    props.confidence >= 0.6 ? 'rgba(255, 212, 59, 0.2)' :
    'rgba(255, 107, 107, 0.2)'
  };
  border: 1px solid ${props => 
    props.confidence >= 0.8 ? 'rgba(81, 207, 102, 0.3)' :
    props.confidence >= 0.6 ? 'rgba(255, 212, 59, 0.3)' :
    'rgba(255, 107, 107, 0.3)'
  };
`;

const ConfidenceText = styled.Text<{ confidence: number }>`
  font-size: 12px;
  font-weight: 600;
  color: ${props => 
    props.confidence >= 0.8 ? '#51cf66' :
    props.confidence >= 0.6 ? '#ffd43b' :
    '#ff6b6b'
  };
`;

const SummaryRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 16px;
  padding: 16px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
`;

const SummaryItem = styled.View`
  align-items: center;
`;

const SummaryValue = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 4px;
`;

const SummaryLabel = styled.Text`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
`;

const Reasoning = styled.Text`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 20px;
  margin-bottom: 20px;
  font-style: italic;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 12px;
`;

const CategoryItem = styled.View`
  margin-bottom: 12px;
  padding: 16px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border-left-width: 4px;
  border-left-color: ${props => 
    props.priority === 'high' ? '#ff6b6b' : 
    props.priority === 'medium' ? '#ffd43b' : 
    '#51cf66'
  };
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

const CategoryBudget = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #4A90E2;
`;

const CategoryDetails = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const CategoryDetail = styled.View`
  align-items: center;
`;

const CategoryDetailValue = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
`;

const CategoryDetailLabel = styled.Text`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
`;

const CategoryReasoning = styled.Text`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 18px;
  margin-bottom: 8px;
`;

const TipsContainer = styled.View`
  margin-top: 8px;
`;

const TipItem = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 4px;
`;

const TipIcon = styled(Ionicons)`
  color: #4A90E2;
  margin-right: 8px;
`;

const TipText = styled.Text`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  flex: 1;
`;

const GoalsContainer = styled.View`
  margin-top: 16px;
`;

const GoalItem = styled.View<{ priority: string }>`
  margin-bottom: 12px;
  padding: 16px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border-left-width: 4px;
  border-left-color: ${props => 
    props.priority === 'high' ? '#ff6b6b' : 
    props.priority === 'medium' ? '#ffd43b' : 
    '#51cf66'
  };
`;

const GoalHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const GoalName = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  flex: 1;
`;

const GoalAmount = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #51cf66;
`;

const GoalProgress = styled.View`
  height: 4px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  margin-bottom: 8px;
`;

const GoalProgressFill = styled.View<{ percentage: number }>`
  height: 4px;
  background-color: #51cf66;
  border-radius: 2px;
  width: ${props => Math.min(props.percentage, 100)}%;
`;

const GoalDetails = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const GoalDetail = styled.View`
  align-items: center;
`;

const GoalDetailValue = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
`;

const GoalDetailLabel = styled.Text`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
`;

const SelectButton = styled.TouchableOpacity`
  background-color: #4A90E2;
  border-radius: 12px;
  padding: 16px;
  align-items: center;
  margin-top: 16px;
`;

const SelectButtonText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
`;

interface BudgetSuggestionCardProps {
  suggestion: AIBudgetSuggestion;
  onSelect: (suggestion: AIBudgetSuggestion) => void;
}

export const BudgetSuggestionCard: React.FC<BudgetSuggestionCardProps> = ({ 
  suggestion, 
  onSelect 
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ff6b6b';
      case 'medium': return '#ffd43b';
      case 'low': return '#51cf66';
      default: return '#868e96';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return 'alert-circle';
      case 'medium': return 'information-circle';
      case 'low': return 'checkmark-circle';
      default: return 'help-circle';
    }
  };

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <TemplateName>{suggestion.template.name}</TemplateName>
          <TemplateDescription>{suggestion.template.description}</TemplateDescription>
        </HeaderLeft>
        <ConfidenceBadge confidence={suggestion.confidence}>
          <ConfidenceText confidence={suggestion.confidence}>
            {Math.round(suggestion.confidence * 100)}% Match
          </ConfidenceText>
        </ConfidenceBadge>
      </Header>

      <SummaryRow>
        <SummaryItem>
          <SummaryValue>{formatCurrency(suggestion.totalBudget)}</SummaryValue>
          <SummaryLabel>Total Budget</SummaryLabel>
        </SummaryItem>
        <SummaryItem>
          <SummaryValue style={{ color: '#51cf66' }}>
            {formatCurrency(suggestion.estimatedSavings)}
          </SummaryValue>
          <SummaryLabel>Monthly Savings</SummaryLabel>
        </SummaryItem>
        <SummaryItem>
          <SummaryValue style={{ color: '#4A90E2' }}>
            {Math.round(suggestion.template.savingsRate * 100)}%
          </SummaryValue>
          <SummaryLabel>Savings Rate</SummaryLabel>
        </SummaryItem>
      </SummaryRow>

      <Reasoning>{suggestion.reasoning}</Reasoning>

      <SectionTitle>Budget Breakdown</SectionTitle>
      <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 300 }}>
        {suggestion.categories.map((category, index) => (
          <CategoryItem key={index} priority={category.priority}>
            <CategoryHeader>
              <CategoryName>{category.category}</CategoryName>
              <CategoryBudget>{formatCurrency(category.suggestedBudget)}</CategoryBudget>
            </CategoryHeader>
            
            <CategoryDetails>
              <CategoryDetail>
                <CategoryDetailValue>{category.percentage.toFixed(1)}%</CategoryDetailValue>
                <CategoryDetailLabel>of income</CategoryDetailLabel>
              </CategoryDetail>
              <CategoryDetail>
                <CategoryDetailValue>{formatCurrency(category.currentSpending)}</CategoryDetailValue>
                <CategoryDetailLabel>current</CategoryDetailLabel>
              </CategoryDetail>
              <CategoryDetail>
                <CategoryDetailValue>
                  {category.currentSpending > category.suggestedBudget ? '+' : '-'}
                  {formatCurrency(Math.abs(category.currentSpending - category.suggestedBudget))}
                </CategoryDetailValue>
                <CategoryDetailLabel>difference</CategoryDetailLabel>
              </CategoryDetail>
            </CategoryDetails>
            
            <CategoryReasoning>{category.reasoning}</CategoryReasoning>
            
            {category.tips.length > 0 && (
              <TipsContainer>
                {category.tips.map((tip, tipIndex) => (
                  <TipItem key={tipIndex}>
                    <TipIcon name="bulb" size={12} />
                    <TipText>{tip}</TipText>
                  </TipItem>
                ))}
              </TipsContainer>
            )}
          </CategoryItem>
        ))}
      </ScrollView>

      {suggestion.goals.length > 0 && (
        <GoalsContainer>
          <SectionTitle>Financial Goals</SectionTitle>
          {suggestion.goals.map((goal, index) => {
            const progressPercentage = (goal.currentAmount / goal.targetAmount) * 100;
            return (
              <GoalItem key={index} priority={goal.priority}>
                <GoalHeader>
                  <GoalName>{goal.name}</GoalName>
                  <GoalAmount>{formatCurrency(goal.targetAmount)}</GoalAmount>
                </GoalHeader>
                
                <GoalProgress>
                  <GoalProgressFill percentage={progressPercentage} />
                </GoalProgress>
                
                <GoalDetails>
                  <GoalDetail>
                    <GoalDetailValue>{formatCurrency(goal.currentAmount)}</GoalDetailValue>
                    <GoalDetailLabel>Saved</GoalDetailLabel>
                  </GoalDetail>
                  <GoalDetail>
                    <GoalDetailValue>{formatCurrency(goal.targetAmount - goal.currentAmount)}</GoalDetailValue>
                    <GoalDetailLabel>Remaining</GoalDetailLabel>
                  </GoalDetail>
                  <GoalDetail>
                    <GoalDetailValue>{goal.deadline}</GoalDetailValue>
                    <GoalDetailLabel>Target Date</GoalDetailLabel>
                  </GoalDetail>
                </GoalDetails>
              </GoalItem>
            );
          })}
        </GoalsContainer>
      )}

      <SelectButton onPress={() => onSelect(suggestion)}>
        <SelectButtonText>Select This Budget</SelectButtonText>
      </SelectButton>
    </Container>
  );
}; 