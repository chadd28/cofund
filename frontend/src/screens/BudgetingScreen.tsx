import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { ScrollView, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Background } from '../components/Background';
import { SpendingOverview } from '../components/SpendingOverview';
import { CategoryInsights } from '../components/CategoryInsights';
import { AIInsights } from '../components/AIInsights';
import { SpendingPieChart } from '../components/SpendingPieChart';
import { AIBudgetingService, SpendingAnalytics } from '../services/aiBudgetingService';
import { getMockTransactions } from '../services/mockTransactionService';

const Container = styled.View`
  flex: 1;
  padding: 20px;
`;

const Header = styled.View`
  margin-bottom: 24px;
`;

const HeaderTitle = styled.Text`
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.5px;
  margin-bottom: 16px;
`;

const HeaderActions = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const CreateBudgetButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 12px 16px;
  background-color: rgba(74, 144, 226, 0.2);
  border-radius: 20px;
  border: 1px solid rgba(74, 144, 226, 0.3);
`;

const CreateBudgetText = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #4A90E2;
  margin-left: 6px;
`;

const RefreshButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.1);
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const LoadingText = styled.Text`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 16px;
`;

const ErrorContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 40px;
`;

const ErrorText = styled.Text`
  font-size: 16px;
  color: #ff6b6b;
  text-align: center;
  line-height: 24px;
`;

const RetryButton = styled.TouchableOpacity`
  margin-top: 20px;
  padding: 12px 24px;
  background-color: rgba(255, 107, 107, 0.2);
  border-radius: 12px;
  border: 1px solid rgba(255, 107, 107, 0.3);
`;

const RetryButtonText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #ff6b6b;
`;

const EmptyStateContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 40px;
`;

const EmptyStateIcon = styled(Ionicons)`
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 16px;
`;

const EmptyStateTitle = styled.Text`
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 8px;
  text-align: center;
`;

const EmptyStateText = styled.Text`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  line-height: 24px;
  margin-bottom: 24px;
`;

const CreateBudgetPromptButton = styled.TouchableOpacity`
  background-color: #4A90E2;
  border-radius: 12px;
  padding: 16px 24px;
  align-items: center;
`;

const CreateBudgetPromptText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
`;

export const BudgetingScreen: React.FC = () => {
  const navigation = useNavigation();
  const [analytics, setAnalytics] = useState<SpendingAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBudgetData = async () => {
    try {
      setError(null);
      
      // Get transactions from mock service
      const response = await getMockTransactions('demo-checking-001');
      
      if (!response.success || !response.transactions) {
        throw new Error('Failed to load transaction data');
      }

      // Analyze spending with AI
      const spendingAnalytics = AIBudgetingService.analyzeSpending(response.transactions);
      setAnalytics(spendingAnalytics);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while loading budget data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadBudgetData();
    setRefreshing(false);
  };

  const handleCreateBudget = () => {
    navigation.navigate('AIBudgetCreation' as never);
  };

  useEffect(() => {
    loadBudgetData();
  }, []);

  if (loading) {
    return (
      <Background>
        <Container>
          <LoadingContainer>
            <Ionicons name="analytics" size={48} color="rgba(255, 255, 255, 0.5)" />
            <LoadingText>Analyzing your spending patterns...</LoadingText>
          </LoadingContainer>
        </Container>
      </Background>
    );
  }

  if (error) {
    return (
      <Background>
        <Container>
          <ErrorContainer>
            <Ionicons name="warning" size={48} color="#ff6b6b" />
            <ErrorText>{error}</ErrorText>
            <RetryButton onPress={loadBudgetData}>
              <RetryButtonText>Try Again</RetryButtonText>
            </RetryButton>
          </ErrorContainer>
        </Container>
      </Background>
    );
  }

  if (!analytics) {
    return (
      <Background>
        <Container>
          <EmptyStateContainer>
            <EmptyStateIcon name="analytics-outline" size={64} />
            <EmptyStateTitle>No Spending Data</EmptyStateTitle>
            <EmptyStateText>
              Connect your accounts to start getting AI-powered budgeting insights and recommendations.
            </EmptyStateText>
            <CreateBudgetPromptButton onPress={handleCreateBudget}>
              <CreateBudgetPromptText>Create AI Budget</CreateBudgetPromptText>
            </CreateBudgetPromptButton>
          </EmptyStateContainer>
        </Container>
      </Background>
    );
  }

  return (
    <Background>
      <Container>
        <Header>
          <HeaderTitle>AI Budgeting</HeaderTitle>
          <HeaderActions>
            <CreateBudgetButton onPress={handleCreateBudget}>
              <Ionicons name="add-circle" size={16} color="#4A90E2" />
              <CreateBudgetText>Create Budget</CreateBudgetText>
            </CreateBudgetButton>
            <RefreshButton onPress={handleRefresh}>
              <Ionicons 
                name="refresh" 
                size={20} 
                color="rgba(255, 255, 255, 0.7)" 
              />
            </RefreshButton>
          </HeaderActions>
        </Header>

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="rgba(255, 255, 255, 0.7)"
            />
          }
        >
          <SpendingOverview analytics={analytics} />
          
          <SpendingPieChart 
            categories={analytics.topCategories}
            totalSpending={analytics.totalSpending}
          />
          
          <CategoryInsights categories={analytics.topCategories} />
          
          <AIInsights 
            insights={analytics.insights}
            recommendations={analytics.recommendations}
          />
        </ScrollView>
      </Container>
    </Background>
  );
}; 