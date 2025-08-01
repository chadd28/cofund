import React, { useState } from 'react';
import styled from 'styled-components/native';
import { ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BudgetCreationRequest } from '../services/aiBudgetCreationService';

const Container = styled.View`
  flex: 1;
  margin-bottom: 80px; /* Space for bottom tab bar */
`;

const ContentContainer = styled.View`
  flex: 1;
  padding: 20px;
  padding-bottom: 20px;
`;

const StepIndicator = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const StepDot = styled.View<{ active: boolean; completed: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 6px;
  background-color: ${props => 
    props.completed ? '#51cf66' : 
    props.active ? '#4A90E2' : 
    'rgba(255, 255, 255, 0.3)'
  };
`;

const StepLine = styled.View<{ completed: boolean }>`
  flex: 1;
  height: 2px;
  background-color: ${props => props.completed ? '#51cf66' : 'rgba(255, 255, 255, 0.3)'};
  margin: 0 8px;
  align-self: center;
`;

const StepContainer = styled.View`
  flex: 1;
`;

const StepTitle = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 8px;
`;

const StepDescription = styled.Text`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 24px;
  line-height: 24px;
`;

const InputGroup = styled.View`
  margin-bottom: 20px;
`;

const InputLabel = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 8px;
`;

const Input = styled.TextInput`
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
  font-size: 16px;
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const SelectContainer = styled.View`
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
`;

const SelectOption = styled.TouchableOpacity<{ selected: boolean }>`
  padding: 16px;
  background-color: ${props => props.selected ? 'rgba(74, 144, 226, 0.3)' : 'transparent'};
  border-bottom-width: 1px;
  border-bottom-color: rgba(255, 255, 255, 0.1);
`;

const SelectOptionText = styled.Text<{ selected: boolean }>`
  font-size: 16px;
  color: ${props => props.selected ? '#4A90E2' : '#ffffff'};
  font-weight: ${props => props.selected ? '600' : '400'};
`;

const SelectOptionDescription = styled.Text<{ selected: boolean }>`
  font-size: 14px;
  color: ${props => props.selected ? 'rgba(74, 144, 226, 0.8)' : 'rgba(255, 255, 255, 0.6)'};
  margin-top: 4px;
`;

const GoalInputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 12px;
`;

const GoalInput = styled.TextInput`
  flex: 1;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 16px;
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-right: 12px;
`;

const RemoveGoalButton = styled.TouchableOpacity`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: rgba(255, 107, 107, 0.2);
  align-items: center;
  justify-content: center;
`;

const AddGoalButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 12px 16px;
  background-color: rgba(74, 144, 226, 0.2);
  border-radius: 12px;
  border: 1px dashed rgba(74, 144, 226, 0.5);
`;

const AddGoalText = styled.Text`
  font-size: 16px;
  color: #4A90E2;
  margin-left: 8px;
`;

const NavigationContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.8);
  border-top-width: 2px;
  border-top-color: rgba(255, 255, 255, 0.3);
  shadow-color: #000;
  shadow-offset: 0px -2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  elevation: 5;
  min-height: 80px;
`;

const NavigationButton = styled.TouchableOpacity<{ primary?: boolean; disabled?: boolean }>`
  padding: 18px 32px;
  border-radius: 12px;
  background-color: ${props => 
    props.disabled ? 'rgba(255, 255, 255, 0.1)' :
    props.primary ? '#4A90E2' : 'rgba(255, 255, 255, 0.1)'
  };
  border: 2px solid ${props => 
    props.disabled ? 'rgba(255, 255, 255, 0.2)' :
    props.primary ? '#5BA3F5' : 'rgba(255, 255, 255, 0.2)'
  };
  opacity: ${props => props.disabled ? 0.5 : 1};
  shadow-color: ${props => props.primary && !props.disabled ? '#4A90E2' : '#000'};
  shadow-offset: 0px 2px;
  shadow-opacity: ${props => props.primary && !props.disabled ? 0.3 : 0.1};
  shadow-radius: 4px;
  elevation: ${props => props.primary && !props.disabled ? 3 : 1};
`;

const NavigationButtonText = styled.Text<{ primary?: boolean; disabled?: boolean }>`
  font-size: 18px;
  font-weight: 700;
  color: ${props => 
    props.disabled ? 'rgba(255, 255, 255, 0.5)' :
    props.primary ? '#ffffff' : 'rgba(255, 255, 255, 0.8)'
  };
  text-align: center;
`;

const ValidationMessage = styled.Text<{ isValid: boolean }>`
  font-size: 14px;
  color: ${props => props.isValid ? '#51cf66' : '#ff6b6b'};
  margin-top: 8px;
  font-style: italic;
`;

interface BudgetCreationWizardProps {
  onComplete: (request: BudgetCreationRequest) => void;
}

const STEPS = [
  { id: 1, title: 'Income & Basics', description: 'Tell us about your monthly income and basic financial situation' },
  { id: 2, title: 'Financial Goals', description: 'What are your main financial goals and priorities?' },
  { id: 3, title: 'Risk & Lifestyle', description: 'How do you prefer to balance risk and lifestyle choices?' },
  { id: 4, title: 'Current Situation', description: 'Help us understand your current financial situation' }
];

export const BudgetCreationWizard: React.FC<BudgetCreationWizardProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [request, setRequest] = useState<BudgetCreationRequest>({
    monthlyIncome: 0,
    financialGoals: [''],
    riskTolerance: 'moderate',
    lifestyle: 'balanced',
    emergencyFund: 0,
    debtPayments: 0
  });

  const updateRequest = (updates: Partial<BudgetCreationRequest>) => {
    setRequest(prev => ({ ...prev, ...updates }));
  };

  const addGoal = () => {
    updateRequest({
      financialGoals: [...request.financialGoals, '']
    });
  };

  const removeGoal = (index: number) => {
    const newGoals = request.financialGoals.filter((_, i) => i !== index);
    updateRequest({ financialGoals: newGoals });
  };

  const updateGoal = (index: number, value: string) => {
    const newGoals = [...request.financialGoals];
    newGoals[index] = value;
    updateRequest({ financialGoals: newGoals });
  };

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(request);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep1 = () => (
    <StepContainer>
      <InputGroup>
        <InputLabel>Monthly Income</InputLabel>
        <Input
          placeholder="Enter your monthly income"
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          keyboardType="numeric"
          value={request.monthlyIncome ? request.monthlyIncome.toString() : ''}
          onChangeText={(text) => updateRequest({ monthlyIncome: parseFloat(text) || 0 })}
        />
        <ValidationMessage isValid={request.monthlyIncome > 0}>
          {request.monthlyIncome > 0 ? '✓ Income entered' : 'Please enter your monthly income to continue'}
        </ValidationMessage>
      </InputGroup>
    </StepContainer>
  );

  const renderStep2 = () => (
    <StepContainer>
      <InputGroup>
        <InputLabel>Financial Goals</InputLabel>
        {request.financialGoals.map((goal, index) => (
          <GoalInputContainer key={index}>
            <GoalInput
              placeholder="e.g., Save for vacation, Buy a house, Pay off debt"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={goal}
              onChangeText={(text) => updateGoal(index, text)}
            />
            {request.financialGoals.length > 1 && (
              <RemoveGoalButton onPress={() => removeGoal(index)}>
                <Ionicons name="close" size={16} color="#ff6b6b" />
              </RemoveGoalButton>
            )}
          </GoalInputContainer>
        ))}
        <AddGoalButton onPress={addGoal}>
          <Ionicons name="add" size={20} color="#4A90E2" />
          <AddGoalText>Add Another Goal</AddGoalText>
        </AddGoalButton>
        <ValidationMessage isValid={request.financialGoals.some(goal => goal.trim() !== '')}>
          {request.financialGoals.some(goal => goal.trim() !== '') ? '✓ At least one goal entered' : 'Please enter at least one financial goal to continue'}
        </ValidationMessage>
      </InputGroup>
    </StepContainer>
  );

  const renderStep3 = () => (
    <StepContainer>
      <InputGroup>
        <InputLabel>Risk Tolerance</InputLabel>
        <SelectContainer>
          {[
            { value: 'conservative', label: 'Conservative', description: 'Prioritize financial security and stability' },
            { value: 'moderate', label: 'Moderate', description: 'Balance between security and growth' },
            { value: 'aggressive', label: 'Aggressive', description: 'Maximize growth potential' }
          ].map((option) => (
            <SelectOption
              key={option.value}
              selected={request.riskTolerance === option.value}
              onPress={() => updateRequest({ riskTolerance: option.value as any })}
            >
              <SelectOptionText selected={request.riskTolerance === option.value}>
                {option.label}
              </SelectOptionText>
              <SelectOptionDescription selected={request.riskTolerance === option.value}>
                {option.description}
              </SelectOptionDescription>
            </SelectOption>
          ))}
        </SelectContainer>
      </InputGroup>

      <InputGroup>
        <InputLabel>Lifestyle Preference</InputLabel>
        <SelectContainer>
          {[
            { value: 'minimalist', label: 'Minimalist', description: 'Focus on essential spending only' },
            { value: 'balanced', label: 'Balanced', description: 'Mix of essential and discretionary spending' },
            { value: 'luxury', label: 'Luxury', description: 'Comfortable with higher discretionary spending' }
          ].map((option) => (
            <SelectOption
              key={option.value}
              selected={request.lifestyle === option.value}
              onPress={() => updateRequest({ lifestyle: option.value as any })}
            >
              <SelectOptionText selected={request.lifestyle === option.value}>
                {option.label}
              </SelectOptionText>
              <SelectOptionDescription selected={request.lifestyle === option.value}>
                {option.description}
              </SelectOptionDescription>
            </SelectOption>
          ))}
        </SelectContainer>
      </InputGroup>
    </StepContainer>
  );

  const renderStep4 = () => (
    <StepContainer>
      <InputGroup>
        <InputLabel>Current Emergency Fund</InputLabel>
        <Input
          placeholder="How much do you have saved for emergencies?"
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          keyboardType="numeric"
          value={request.emergencyFund ? request.emergencyFund.toString() : ''}
          onChangeText={(text) => updateRequest({ emergencyFund: parseFloat(text) || 0 })}
        />
      </InputGroup>

      <InputGroup>
        <InputLabel>Monthly Debt Payments</InputLabel>
        <Input
          placeholder="Total monthly debt payments (credit cards, loans, etc.)"
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          keyboardType="numeric"
          value={request.debtPayments ? request.debtPayments.toString() : ''}
          onChangeText={(text) => updateRequest({ debtPayments: parseFloat(text) || 0 })}
        />
      </InputGroup>
    </StepContainer>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      default: return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return request.monthlyIncome > 0;
      case 2: return request.financialGoals.some(goal => goal.trim() !== '');
      case 3: return true; // Always valid
      case 4: return true; // Always valid
      default: return false;
    }
  };

  return (
    <Container>
      <ContentContainer>
        <StepIndicator>
          {STEPS.map((step, index) => (
            <React.Fragment key={step.id}>
              <StepDot
                active={currentStep === step.id}
                completed={currentStep > step.id}
              />
              {index < STEPS.length - 1 && (
                <StepLine completed={currentStep > step.id} />
              )}
            </React.Fragment>
          ))}
        </StepIndicator>

        <ScrollView showsVerticalScrollIndicator={false}>
          <StepTitle>{STEPS[currentStep - 1].title}</StepTitle>
          <StepDescription>{STEPS[currentStep - 1].description}</StepDescription>
          
          {renderCurrentStep()}
        </ScrollView>
      </ContentContainer>

      {/* Navigation buttons - ALWAYS VISIBLE AT BOTTOM */}
      <NavigationContainer>
        {currentStep > 1 && (
          <NavigationButton onPress={prevStep}>
            <NavigationButtonText>Back</NavigationButtonText>
          </NavigationButton>
        )}
        
        <NavigationButton
          primary
          disabled={!canProceed()}
          onPress={canProceed() ? nextStep : undefined}
          style={{ 
            marginLeft: currentStep === 1 ? 'auto' : 0,
            minWidth: 140,
            alignItems: 'center',
            backgroundColor: canProceed() ? '#4A90E2' : '#666666'
          }}
        >
          <NavigationButtonText primary disabled={!canProceed()}>
            {currentStep === STEPS.length ? 'Create Budget' : 'Next →'}
          </NavigationButtonText>
        </NavigationButton>
      </NavigationContainer>
    </Container>
  );
}; 