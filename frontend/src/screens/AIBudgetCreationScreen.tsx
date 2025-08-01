import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Background } from '../components/Background';
import { BudgetCreationWizard } from '../components/BudgetCreationWizard';
import { BudgetSuggestionCard } from '../components/BudgetSuggestionCard';
import { AIBudgetCreationService, BudgetCreationRequest, AIBudgetSuggestion } from '../services/aiBudgetCreationService';
import { getMockTransactions } from '../services/mockTransactionService';

const Container = styled.View`
  flex: 1;
`;

const PaddedContainer = styled.View`
  flex: 1;
  padding: 20px;
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const HeaderTitle = styled.Text`
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.5px;
`;

const BackButton = styled.TouchableOpacity`
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

const SuccessContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 40px;
`;

const SuccessIcon = styled(Ionicons)`
  color: #51cf66;
  margin-bottom: 16px;
`;

const SuccessTitle = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 8px;
  text-align: center;
`;

const SuccessText = styled.Text`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  line-height: 24px;
  margin-bottom: 32px;
`;

const SuggestionsContainer = styled.View`
  flex: 1;
`;

const SuggestionsTitle = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 16px;
`;

const SuggestionsSubtitle = styled.Text`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 24px;
  line-height: 24px;
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
  margin-bottom: 20px;
`;

const RetryButton = styled.TouchableOpacity`
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

const RestartButton = styled.TouchableOpacity`
  padding: 12px 24px;
  background-color: rgba(74, 144, 226, 0.2);
  border-radius: 12px;
  border: 1px solid rgba(74, 144, 226, 0.3);
  margin-top: 12px;
`;

const RestartButtonText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #4A90E2;
`;

type ScreenState = 'wizard' | 'loading' | 'suggestions' | 'success' | 'error';

export const AIBudgetCreationScreen: React.FC = () => {
  const navigation = useNavigation();
  const [screenState, setScreenState] = useState<ScreenState>('wizard');
  const [budgetRequest, setBudgetRequest] = useState<BudgetCreationRequest | null>(null);
  const [suggestions, setSuggestions] = useState<AIBudgetSuggestion[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<AIBudgetSuggestion | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleWizardComplete = async (request: BudgetCreationRequest) => {
    setBudgetRequest(request);
    setScreenState('loading');
    
    try {
      // Get transactions from mock service
      const response = await getMockTransactions('demo-checking-001');
      
      if (!response.success || !response.transactions) {
        throw new Error('Failed to load transaction data');
      }

      // Generate AI budget suggestions
      const aiSuggestions = AIBudgetCreationService.generateBudgetSuggestions(
        response.transactions,
        request
      );
      
      setSuggestions(aiSuggestions);
      setScreenState('suggestions');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while generating budget suggestions');
      setScreenState('error');
    }
  };

  const handleBudgetSelect = (suggestion: AIBudgetSuggestion) => {
    setSelectedBudget(suggestion);
    setScreenState('success');
  };

  const handleBackToWizard = () => {
    setScreenState('wizard');
    setBudgetRequest(null);
    setSuggestions([]);
    setSelectedBudget(null);
    setError(null);
  };

  const handleRetry = () => {
    if (budgetRequest) {
      handleWizardComplete(budgetRequest);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const renderWizard = () => (
    <BudgetCreationWizard onComplete={handleWizardComplete} />
  );

  const renderLoading = () => (
    <LoadingContainer>
      <Ionicons name="analytics" size={48} color="rgba(255, 255, 255, 0.5)" />
      <LoadingText>AI is analyzing your spending patterns and creating personalized budget suggestions...</LoadingText>
    </LoadingContainer>
  );

  const renderSuggestions = () => (
    <SuggestionsContainer>
      <SuggestionsTitle>AI Budget Suggestions</SuggestionsTitle>
      <SuggestionsSubtitle>
        Based on your spending patterns and preferences, here are 3 personalized budget options. 
        Each suggestion includes detailed breakdowns and financial goals.
      </SuggestionsSubtitle>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {suggestions.map((suggestion, index) => (
          <BudgetSuggestionCard
            key={index}
            suggestion={suggestion}
            onSelect={handleBudgetSelect}
          />
        ))}
      </ScrollView>
    </SuggestionsContainer>
  );

  const renderSuccess = () => (
    <SuccessContainer>
      <SuccessIcon name="checkmark-circle" size={64} />
      <SuccessTitle>Budget Created Successfully!</SuccessTitle>
      <SuccessText>
        Your AI-powered budget "{selectedBudget?.template.name}" has been created. 
        You can now track your spending against these personalized categories and goals.
      </SuccessText>
      
      <RestartButton onPress={handleBackToWizard}>
        <RestartButtonText>Create Another Budget</RestartButtonText>
      </RestartButton>
    </SuccessContainer>
  );

  const renderError = () => (
    <ErrorContainer>
      <Ionicons name="warning" size={48} color="#ff6b6b" />
      <ErrorText>{error}</ErrorText>
      <RetryButton onPress={handleRetry}>
        <RetryButtonText>Try Again</RetryButtonText>
      </RetryButton>
      <RestartButton onPress={handleBackToWizard}>
        <RestartButtonText>Start Over</RestartButtonText>
      </RestartButton>
    </ErrorContainer>
  );

  const renderCurrentScreen = () => {
    switch (screenState) {
      case 'wizard':
        return renderWizard();
      case 'loading':
        return renderLoading();
      case 'suggestions':
        return renderSuggestions();
      case 'success':
        return renderSuccess();
      case 'error':
        return renderError();
      default:
        return renderWizard();
    }
  };

  const showInternalBackButton = screenState === 'suggestions' || screenState === 'success';

  if (screenState === 'wizard') {
    // Render wizard without extra container to avoid layout issues
    return (
      <Background>
        <Container>
          <Header style={{ padding: 20, paddingBottom: 0 }}>
            <BackButton onPress={handleGoBack}>
              <Ionicons 
                name="arrow-back" 
                size={20} 
                color="rgba(255, 255, 255, 0.7)" 
              />
            </BackButton>
            
            <HeaderTitle>Create AI Budget</HeaderTitle>
          </Header>
          
          {/* Wizard has its own layout, render it directly */}
          <BudgetCreationWizard onComplete={handleWizardComplete} />
        </Container>
      </Background>
    );
  }

  // For other states, use the regular container
  return (
    <Background>
      <PaddedContainer>
        <Header>
          <BackButton onPress={handleGoBack}>
            <Ionicons 
              name="arrow-back" 
              size={20} 
              color="rgba(255, 255, 255, 0.7)" 
            />
          </BackButton>
          
          <HeaderTitle>
            {screenState === 'loading' && 'Analyzing...'}
            {screenState === 'suggestions' && 'Choose Your Budget'}
            {screenState === 'success' && 'Budget Created'}
            {screenState === 'error' && 'Error'}
          </HeaderTitle>
          
          {showInternalBackButton && (
            <BackButton onPress={handleBackToWizard}>
              <Ionicons 
                name="refresh" 
                size={20} 
                color="rgba(255, 255, 255, 0.7)" 
              />
            </BackButton>
          )}
        </Header>

        {renderCurrentScreen()}
      </PaddedContainer>
    </Background>
  );
}; 