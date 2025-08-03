const axios = require("axios");
const { getMockTransactions, getMockAccounts, getMockUserProfile, getMockBudgetData } = require('./mockDataService');

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama3-70b-8192"; // Or 'mixtral-8x7b-32768'

const callGroq = async (userMessage) => {
    console.log("Loaded GROQ_API_KEY:", !!process.env.GROQ_API_KEY);

    // Get mock data for context
    const transactions = getMockTransactions();
    const accounts = getMockAccounts();
    const userProfile = getMockUserProfile();
    const budgetData = getMockBudgetData();

    // Create comprehensive system prompt with user's financial data
    const systemPrompt = `You are a helpful AI finance assistant for CoFund, a personal finance app. You have access to the user's financial data and can provide personalized insights and recommendations.

USER PROFILE:
- Name: ${userProfile.first_name} ${userProfile.last_name}
- Email: ${userProfile.email}
- Phone: ${userProfile.phone}

ACCOUNTS:
${accounts.map(acc => `- ${acc.name}: $${acc.balance.toLocaleString()} (${acc.type})`).join('\n')}

FINANCIAL SUMMARY:
- Total Income: $${budgetData.totalIncome.toLocaleString()}
- Total Spending: $${budgetData.totalSpending.toLocaleString()}
- Net Savings: $${budgetData.netSavings.toLocaleString()}
- Savings Rate: ${budgetData.savingsRate.toFixed(1)}%

SPENDING BY CATEGORY:
${budgetData.categories.map(cat => `- ${cat.category}: $${cat.total.toLocaleString()} (${cat.percentage.toFixed(1)}%) - ${cat.transactionCount} transactions`).join('\n')}

RECENT TRANSACTIONS (Last 10):
${transactions.slice(0, 10).map(tx => `- ${tx.date}: ${tx.description} - $${Math.abs(tx.amount).toLocaleString()} (${tx.user_category})`).join('\n')}

INSTRUCTIONS:
1. Use the user's actual financial data to provide personalized responses
2. When asked about spending, transactions, or accounts, reference the specific data above
3. Provide specific amounts, dates, and categories when relevant
4. Offer actionable financial advice based on their spending patterns
5. Be conversational but professional
6. If asked about data not in the mock data, explain that this is demo data and suggest what real data would show

Remember: This is demo data for testing purposes. In a real app, this would be the user's actual financial information.`;

    const payload = {
        model: MODEL,
        messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
        ],
        temperature: 0.3,
        
    };

    const headers = {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
    };

    try {
        const res = await axios.post(GROQ_API_URL, payload, { headers });
        return res.data.choices[0].message.content;
    } catch (err) {
        console.error("❌ Groq API error:", err.response?.data || err.message);
        throw new Error("Groq LLM request failed");
    }
};

// Enhanced function that accepts full conversation context
const callGroqWithContext = async (messages) => {
    console.log("Loaded GROQ_API_KEY:", !!process.env.GROQ_API_KEY);

    // Get mock data for context
    const transactions = getMockTransactions();
    const accounts = getMockAccounts();
    const userProfile = getMockUserProfile();
    const budgetData = getMockBudgetData();

    // Create comprehensive system prompt with user's financial data
    const systemPrompt = `You are a helpful AI finance assistant for CoFund, a personal finance app. You have access to the user's financial data and can provide personalized insights and recommendations.

USER PROFILE:
- Name: ${userProfile.first_name} ${userProfile.last_name}
- Email: ${userProfile.email}
- Phone: ${userProfile.phone}

ACCOUNTS:
${accounts.map(acc => `- ${acc.name}: $${acc.balance.toLocaleString()} (${acc.type})`).join('\n')}

FINANCIAL SUMMARY:
- Total Income: $${budgetData.totalIncome.toLocaleString()}
- Total Spending: $${budgetData.totalSpending.toLocaleString()}
- Net Savings: $${budgetData.netSavings.toLocaleString()}
- Savings Rate: ${budgetData.savingsRate.toFixed(1)}%

SPENDING BY CATEGORY:
${budgetData.categories.map(cat => `- ${cat.category}: $${cat.total.toLocaleString()} (${cat.percentage.toFixed(1)}%) - ${cat.transactionCount} transactions`).join('\n')}

RECENT TRANSACTIONS (Last 10):
${transactions.slice(0, 10).map(tx => `- ${tx.date}: ${tx.description} - $${Math.abs(tx.amount).toLocaleString()} (${tx.user_category})`).join('\n')}

INSTRUCTIONS:
1. Use the user's actual financial data to provide personalized responses
2. When asked about spending, transactions, or accounts, reference the specific data above
3. Provide specific amounts, dates, and categories when relevant
4. Offer actionable financial advice based on their spending patterns
5. Be conversational but professional
6. If asked about data not in the mock data, explain that this is demo data and suggest what real data would show

Remember: This is demo data for testing purposes. In a real app, this would be the user's actual financial information.`;

    // Add system message at the beginning if not already present
    const messagesWithSystem = messages[0]?.role === 'system' 
        ? messages 
        : [{ role: 'system', content: systemPrompt }, ...messages];

    const payload = {
        model: MODEL,
        messages: messagesWithSystem, // Use messages with system prompt
        temperature: 0.3,
    };

    const headers = {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
    };

    try {
        const res = await axios.post(GROQ_API_URL, payload, { headers });
        return res.data.choices[0].message.content;
    } catch (err) {
        console.error("❌ Groq API error:", err.response?.data || err.message);
        throw new Error("Groq LLM request failed");
    }
};

module.exports = { callGroq, callGroqWithContext };
