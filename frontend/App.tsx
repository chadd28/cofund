import React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';


import { DashboardScreen } from './src/screens/DashboardScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { ChatbotScreen } from './src/screens/ChatbotScreen';
import { TransactionsScreen } from './src/screens/TransactionsScreen';
import { BudgetingScreen } from './src/screens/BudgetingScreen';
import { AIBudgetCreationScreen } from './src/screens/AIBudgetCreationScreen';
import { TellerConnectScreen } from './src/screens/TellerConnectScreen';
import { GlassmorphicTabBar } from './src/components/GlassmorphicTabBar';
import { AuthNavigator } from './src/navigation/AuthNavigator';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { BudgetProvider } from './src/contexts/BudgetContext';


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack navigator for Dashboard and its related screens
const DashboardStack: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="DashboardMain" component={DashboardScreen} />
    <Stack.Screen name="Transactions" component={TransactionsScreen} />
    <Stack.Screen name="TellerConnect" component={TellerConnectScreen} />
  </Stack.Navigator>
);

// Stack navigator for Budgeting and its related screens
const BudgetingStack: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="BudgetingMain" component={BudgetingScreen} />
    <Stack.Screen name="AIBudgetCreation" component={AIBudgetCreationScreen} />
  </Stack.Navigator>
);

const AppTabs: React.FC = () => (
  <Tab.Navigator
    tabBar={(props) => <GlassmorphicTabBar {...props} />}
    screenOptions={{
      headerShown: false,
    }}
  >
    <Tab.Screen name="Dashboard" component={DashboardStack} />
    <Tab.Screen name="Budgeting" component={BudgetingStack} />
    <Tab.Screen name="Chatbot" component={ChatbotScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      {isAuthenticated ? <AppTabs /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BudgetProvider>
        <AppContent />
      </BudgetProvider>
    </AuthProvider>
  );
}


