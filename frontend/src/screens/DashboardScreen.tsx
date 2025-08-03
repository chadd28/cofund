import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AccountCarousel } from '../components/AccountCarousel';
import { Account, DashboardState } from '../types/account';
import { Background } from '../components/Background';
import { getMockAccounts } from '../services/mockAccountService';
import { useAuth } from '../contexts/AuthContext';

// Styled components for glassmorphism dashboard
const Container = styled.View`
  flex: 1;
`;

const ScrollContainer = styled(ScrollView)`
  flex: 1;
  padding: 20px;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 30px;
`;

const HeaderTitle = styled.Text`
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.5px;
`;

const AvatarContainer = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.2);
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.3);
`;

const AvatarText = styled.Text`
  font-size: 18px;
  color: #ffffff;
  font-weight: 600;
`;

const SectionTitle = styled.Text`
  font-size: 20px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 16px;
  letter-spacing: -0.5px;
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ErrorContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const ErrorText = styled.Text`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  line-height: 24px;
`;

const TransactionsButton = styled(TouchableOpacity)`
  margin-top: 24px;
  padding: 16px;
  border-radius: 16px;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  align-items: center;
`;

const TransactionsButtonText = styled.Text`
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
`;

const AddAccountButton = styled(TouchableOpacity)`
  margin-top: 16px;
  padding: 16px;
  border-radius: 16px;
  background-color: rgba(74, 144, 226, 0.2);
  border: 1px solid rgba(74, 144, 226, 0.3);
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;

const AddAccountButtonText = styled.Text`
  color: #4A90E2;
  font-size: 16px;
  font-weight: 600;
  margin-left: 8px;
`;

const LogoutButton = styled(TouchableOpacity)`
  position: absolute;
  top: 0;
  right: 0;
  padding: 8px;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const HeaderContainer = styled.View`
  position: relative;
  flex-direction: row;
  align-items: center;
  margin-bottom: 30px;
`;

type DashboardStackParamList = {
  DashboardMain: undefined;
  Transactions: undefined;
  TellerConnect: undefined;
};

type DashboardScreenNavigationProp = NativeStackNavigationProp<
  DashboardStackParamList,
  'DashboardMain'
>;

export const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<DashboardScreenNavigationProp>();
  const { signOut } = useAuth();
  const [state, setState] = useState<DashboardState>({
    accounts: [],
    isLoading: true,
    error: null,
  });

  // Load mock account data for demo
  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const response = await getMockAccounts();
        
        if (response.success) {
          setState({
            accounts: response.accounts,
            isLoading: false,
            error: null,
          });
        } else {
          setState({
            accounts: [],
            isLoading: false,
            error: response.error || 'Failed to load accounts. Please try again.',
          });
        }
      } catch (error) {
        setState({
          accounts: [],
          isLoading: false,
          error: 'Failed to load accounts. Please try again.',
        });
      }
    };

    loadAccounts();
  }, []);



  if (state.isLoading) {
    return (
      <Background>
        <LoadingContainer>
          <ActivityIndicator size="large" color="#ffffff" />
        </LoadingContainer>
      </Background>
    );
  }

  if (state.error) {
    return (
      <Background>
        <ErrorContainer>
          <ErrorText>{state.error}</ErrorText>
        </ErrorContainer>
      </Background>
    );
  }

  const handleTransactionsPress = () => {
    navigation.navigate('Transactions');
  };

  const handleAddAccount = () => {
    navigation.navigate('TellerConnect');
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <Background>
      <ScrollContainer showsVerticalScrollIndicator={false}>
        <HeaderContainer>
          <HeaderTitle>Dashboard</HeaderTitle>
          <LogoutButton onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#ffffff" />
          </LogoutButton>
        </HeaderContainer>

        <SectionTitle>Your Accounts</SectionTitle>
        
        <AccountCarousel accounts={state.accounts} />
        
        <AddAccountButton onPress={handleAddAccount}>
          <Ionicons name="add-circle" size={20} color="#4A90E2" />
          <AddAccountButtonText>Add Another Account</AddAccountButtonText>
        </AddAccountButton>
        
        <TransactionsButton onPress={handleTransactionsPress}>
          <TransactionsButtonText>View Recent Transactions →</TransactionsButtonText>
        </TransactionsButton>
      </ScrollContainer>
    </Background>
  );
}; 