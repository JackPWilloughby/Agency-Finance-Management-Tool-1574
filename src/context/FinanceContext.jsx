import React, { createContext, useContext, useReducer, useEffect } from 'react';

const FinanceContext = createContext();

const initialState = {
  clients: [],
  projects: [],
  costs: {
    team: [],
    marketing: [],
    operations: []
  },
  financialReports: {
    profitLoss: null,
    balanceSheet: null,
    bankTransactions: null
  },
  settings: {
    corporationTaxRate: 0.19,
    currency: 'GBP',
    fiscalYearStart: 'April',
    currentFiscalYear: new Date().getFullYear(),
    viewMode: 'current' // 'current' or 'allTime'
  },
  historicalData: {}
};

function financeReducer(state, action) {
  switch (action.type) {
    case 'ADD_CLIENT':
      return {
        ...state,
        clients: [...state.clients, { ...action.payload, id: Date.now() }]
      };

    case 'UPDATE_CLIENT':
      return {
        ...state,
        clients: state.clients.map(client =>
          client.id === action.payload.id ? action.payload : client
        )
      };

    case 'DELETE_CLIENT':
      return {
        ...state,
        clients: state.clients.filter(client => client.id !== action.payload)
      };

    case 'ADD_PROJECT':
      return {
        ...state,
        projects: [...state.projects, { ...action.payload, id: Date.now() }]
      };

    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(project =>
          project.id === action.payload.id ? action.payload : project
        )
      };

    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(project => project.id !== action.payload)
      };

    case 'ADD_COST':
      return {
        ...state,
        costs: {
          ...state.costs,
          [action.payload.category]: [
            ...state.costs[action.payload.category],
            { ...action.payload, id: Date.now() }
          ]
        }
      };

    case 'UPDATE_COST':
      return {
        ...state,
        costs: {
          ...state.costs,
          [action.payload.category]: state.costs[action.payload.category].map(cost =>
            cost.id === action.payload.id ? action.payload : cost
          )
        }
      };

    case 'DELETE_COST':
      return {
        ...state,
        costs: {
          ...state.costs,
          [action.payload.category]: state.costs[action.payload.category].filter(
            cost => cost.id !== action.payload.id
          )
        }
      };

    case 'UPLOAD_FINANCIAL_REPORT':
      console.log('===UPLOADING FINANCIAL REPORT===');
      console.log('Type:', action.payload.type);
      console.log('Fiscal Year:', state.settings.currentFiscalYear);
      console.log('Data:', action.payload.data);

      // Store data for current fiscal year only
      const updatedReports = {
        ...state.financialReports,
        [action.payload.type]: {
          ...action.payload.data,
          fiscalYear: state.settings.currentFiscalYear,
          uploadDate: new Date().toISOString(),
          originalFileName: action.payload.fileName
        }
      };

      // Store in historical data for the specific fiscal year
      const updatedHistoricalData = {
        ...state.historicalData,
        [state.settings.currentFiscalYear]: {
          ...state.historicalData[state.settings.currentFiscalYear],
          [action.payload.type]: {
            ...action.payload.data,
            fiscalYear: state.settings.currentFiscalYear,
            uploadDate: new Date().toISOString(),
            originalFileName: action.payload.fileName
          }
        }
      };

      console.log('Updated reports for FY', state.settings.currentFiscalYear, ':', updatedReports);

      return {
        ...state,
        financialReports: updatedReports,
        historicalData: updatedHistoricalData
      };

    case 'DELETE_FINANCIAL_REPORT':
      const newReports = { ...state.financialReports };
      newReports[action.payload] = null;

      const newHistoricalData = { ...state.historicalData };
      if (newHistoricalData[state.settings.currentFiscalYear]) {
        delete newHistoricalData[state.settings.currentFiscalYear][action.payload];
      }

      return {
        ...state,
        financialReports: newReports,
        historicalData: newHistoricalData
      };

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };

    case 'CHANGE_FISCAL_YEAR':
      console.log('===CHANGING FISCAL YEAR===');
      console.log('From:', state.settings.currentFiscalYear);
      console.log('To:', action.payload);

      const yearData = state.historicalData[action.payload] || {};
      console.log('Loading data for FY', action.payload, ':', yearData);

      return {
        ...state,
        settings: {
          ...state.settings,
          currentFiscalYear: action.payload
        },
        financialReports: {
          profitLoss: yearData.profitLoss || null,
          balanceSheet: yearData.balanceSheet || null,
          bankTransactions: yearData.bankTransactions || null
        }
      };

    case 'SET_VIEW_MODE':
      console.log('===CHANGING VIEW MODE===');
      console.log('From:', state.settings.viewMode);
      console.log('To:', action.payload);

      return {
        ...state,
        settings: {
          ...state.settings,
          viewMode: action.payload
        }
      };

    case 'LOAD_DATA':
      return { ...initialState, ...action.payload };

    case 'CLEAR_ALL_DATA':
      return initialState;

    default:
      return state;
  }
}

// Helper function to get fiscal year date range
const getFiscalYearDateRange = (fiscalYear, fiscalYearStart) => {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const startMonthIndex = monthNames.indexOf(fiscalYearStart);
  if (startMonthIndex === -1) return null;
  
  const startDate = new Date(fiscalYear, startMonthIndex, 1);
  const endDate = new Date(fiscalYear + 1, startMonthIndex, 0); // Last day of previous month
  
  return { startDate, endDate };
};

// Helper function to check if a date falls within a fiscal year
const isDateInFiscalYear = (dateString, fiscalYear, fiscalYearStart) => {
  if (!dateString) return false;
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return false;
  
  const range = getFiscalYearDateRange(fiscalYear, fiscalYearStart);
  if (!range) return false;
  
  return date >= range.startDate && date <= range.endDate;
};

// FIXED: Helper function to check if an item should be included in the SPECIFIC fiscal year
const isItemInFiscalYear = (item, fiscalYear, fiscalYearStart) => {
  // If no start date, exclude from calculations (don't assume anything)
  if (!item.startDate) {
    console.log(`⚠️ Item "${item.name}" has no start date - EXCLUDING from all FY calculations`);
    return false;
  }
  
  const itemDate = new Date(item.startDate);
  if (isNaN(itemDate.getTime())) {
    console.log(`⚠️ Item "${item.name}" has invalid date "${item.startDate}" - EXCLUDING`);
    return false;
  }
  
  // Check if the item's start date falls within the specific fiscal year
  const isInFY = isDateInFiscalYear(item.startDate, fiscalYear, fiscalYearStart);
  
  console.log(`📅 Item "${item.name}" (${item.startDate}) for FY ${fiscalYear}: ${isInFY ? 'INCLUDED' : 'EXCLUDED'}`);
  
  return isInFY;
};

// NEW: Helper function for "all time" view - includes everything with dates
const isItemValidForAllTime = (item) => {
  // For all-time view, include any item that has a valid start date
  if (!item.startDate) {
    console.log(`⚠️ Item "${item.name}" has no start date - EXCLUDING from all-time view`);
    return false;
  }
  
  const itemDate = new Date(item.startDate);
  if (isNaN(itemDate.getTime())) {
    console.log(`⚠️ Item "${item.name}" has invalid date "${item.startDate}" - EXCLUDING from all-time view`);
    return false;
  }
  
  return true;
};

export const FinanceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(financeReducer, initialState);

  useEffect(() => {
    const savedData = localStorage.getItem('agency_finance_data');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        dispatch({ type: 'LOAD_DATA', payload: parsedData });
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('agency_finance_data', JSON.stringify(state));
  }, [state]);

  const calculateMetrics = () => {
    console.log('===CALCULATING METRICS===');
    console.log('View Mode:', state.settings.viewMode);
    console.log('Current FY:', state.settings.currentFiscalYear);
    console.log('Fiscal Year Start:', state.settings.fiscalYearStart);
    
    let totalRevenue = 0;
    let totalCosts = 0;

    if (state.settings.viewMode === 'allTime') {
      console.log('===CALCULATING ALL TIME METRICS===');
      
      // For all-time view, include items that have valid dates
      const validClients = state.clients.filter(c => 
        c.type === 'retainer' && isItemValidForAllTime(c)
      );
      
      const validProjects = state.projects.filter(p => 
        isItemValidForAllTime(p)
      );

      console.log('📊 All-time filtering:');
      console.log('📊 Valid clients:', validClients.length, 'of', state.clients.length);
      console.log('📊 Valid projects:', validProjects.length, 'of', state.projects.length);

      const manualRevenue = [
        ...validClients,
        ...validProjects
      ].reduce((sum, item) => {
        const amount = parseFloat(item.amount) || 0;
        console.log(`💰 All-time: Adding ${item.name}: £${amount}`);
        return sum + amount;
      }, 0);

      const manualCosts = Object.values(state.costs).flat().reduce((sum, cost) => {
        const amount = parseFloat(cost.amount) || 0;
        return sum + amount;
      }, 0);

      totalRevenue = manualRevenue;
      totalCosts = manualCosts;

      // Add all historical financial reports
      Object.values(state.historicalData).forEach(yearData => {
        if (yearData.profitLoss) {
          if (yearData.profitLoss.totalRevenue) {
            totalRevenue += yearData.profitLoss.totalRevenue;
          }
          if (yearData.profitLoss.totalExpenses) {
            totalCosts += yearData.profitLoss.totalExpenses;
          }
        }

        if (yearData.bankTransactions) {
          const transactionRevenue = yearData.bankTransactions.transactions
            ?.filter(t => t.type === 'credit' && t.amount > 0)
            .reduce((sum, t) => sum + t.amount, 0) || 0;
          
          const transactionExpenses = yearData.bankTransactions.transactions
            ?.filter(t => t.type === 'debit' && t.amount > 0)
            .reduce((sum, t) => sum + t.amount, 0) || 0;
          
          totalRevenue += transactionRevenue;
          totalCosts += transactionExpenses;
        }
      });

      console.log('All Time Totals:', { totalRevenue, totalCosts });

    } else {
      console.log('===CALCULATING SPECIFIC FY METRICS===');
      console.log('Target FY:', state.settings.currentFiscalYear);
      
      // FIXED: For specific FY view, only include items that fall within that exact fiscal year
      const fyClients = state.clients.filter(c => 
        c.type === 'retainer' && 
        isItemInFiscalYear(c, state.settings.currentFiscalYear, state.settings.fiscalYearStart)
      );
      
      const fyProjects = state.projects.filter(p => 
        isItemInFiscalYear(p, state.settings.currentFiscalYear, state.settings.fiscalYearStart)
      );

      console.log('📅 FY-specific filtering for', state.settings.currentFiscalYear);
      console.log('📅 FY clients:', fyClients.length, 'of', state.clients.length);
      console.log('📅 FY projects:', fyProjects.length, 'of', state.projects.length);
      
      // Log all clients and their status
      state.clients.forEach(client => {
        const isInFY = isItemInFiscalYear(client, state.settings.currentFiscalYear, state.settings.fiscalYearStart);
        console.log(`📅 Client "${client.name}" (${client.startDate || 'NO DATE'}) for FY ${state.settings.currentFiscalYear}: ${isInFY ? '✅ INCLUDED' : '❌ EXCLUDED'}`);
      });
      
      // Log all projects and their status
      state.projects.forEach(project => {
        const isInFY = isItemInFiscalYear(project, state.settings.currentFiscalYear, state.settings.fiscalYearStart);
        console.log(`📅 Project "${project.name}" (${project.startDate || 'NO DATE'}) for FY ${state.settings.currentFiscalYear}: ${isInFY ? '✅ INCLUDED' : '❌ EXCLUDED'}`);
      });

      const manualRevenue = [
        ...fyClients,
        ...fyProjects
      ].reduce((sum, item) => {
        const amount = parseFloat(item.amount) || 0;
        console.log(`💰 FY ${state.settings.currentFiscalYear}: Adding ${item.name}: £${amount}`);
        return sum + amount;
      }, 0);

      // For costs, we include all manual costs as they're typically ongoing operational expenses
      const manualCosts = Object.values(state.costs).flat().reduce((sum, cost) => {
        const amount = parseFloat(cost.amount) || 0;
        return sum + amount;
      }, 0);

      // Start with filtered manual data
      totalRevenue = manualRevenue;
      totalCosts = manualCosts;

      console.log('📅 Manual Revenue (FY filtered):', manualRevenue);
      console.log('📅 Manual Costs (all):', manualCosts);

      // Get reports for current fiscal year only
      const { profitLoss, balanceSheet, bankTransactions } = state.financialReports;

      // Process uploaded P&L data for current fiscal year only
      if (profitLoss && profitLoss.fiscalYear === state.settings.currentFiscalYear) {
        console.log('📊 Adding P&L data for FY', state.settings.currentFiscalYear);
        
        if (profitLoss.totalRevenue && typeof profitLoss.totalRevenue === 'number') {
          totalRevenue += profitLoss.totalRevenue;
          console.log('📊 Added P&L revenue:', profitLoss.totalRevenue);
        } else if (profitLoss.revenue && typeof profitLoss.revenue === 'object') {
          const uploadedRevenue = Object.values(profitLoss.revenue).reduce((sum, item) => {
            const value = typeof item === 'object' ? (parseFloat(item.value) || 0) : (parseFloat(item) || 0);
            return sum + value;
          }, 0);
          totalRevenue += uploadedRevenue;
          console.log('📊 Added P&L revenue (calculated):', uploadedRevenue);
        }

        if (profitLoss.totalExpenses && typeof profitLoss.totalExpenses === 'number') {
          totalCosts += profitLoss.totalExpenses;
          console.log('📊 Added P&L expenses:', profitLoss.totalExpenses);
        } else if (profitLoss.expenses && typeof profitLoss.expenses === 'object') {
          const uploadedCosts = Object.values(profitLoss.expenses).reduce((sum, item) => {
            const value = typeof item === 'object' ? (parseFloat(item.value) || 0) : (parseFloat(item) || 0);
            return sum + value;
          }, 0);
          totalCosts += uploadedCosts;
          console.log('📊 Added P&L expenses (calculated):', uploadedCosts);
        }
      }

      // Process bank transactions for current fiscal year only
      if (bankTransactions && bankTransactions.fiscalYear === state.settings.currentFiscalYear) {
        console.log('🏦 Adding bank transaction data for FY', state.settings.currentFiscalYear);
        
        const transactionRevenue = bankTransactions.transactions
          ?.filter(t => t.type === 'credit' && t.amount > 0)
          .reduce((sum, t) => sum + t.amount, 0) || 0;
        
        const transactionExpenses = bankTransactions.transactions
          ?.filter(t => t.type === 'debit' && t.amount > 0)
          .reduce((sum, t) => sum + t.amount, 0) || 0;
        
        totalRevenue += transactionRevenue;
        totalCosts += transactionExpenses;
        
        console.log('🏦 Added transaction revenue:', transactionRevenue);
        console.log('🏦 Added transaction expenses:', transactionExpenses);
      }
    }

    const grossProfit = totalRevenue - totalCosts;
    const corporationTax = grossProfit > 0 ? grossProfit * state.settings.corporationTaxRate : 0;
    const netProfit = grossProfit - corporationTax;
    const profitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

    // Balance sheet metrics (only for current year)
    let currentAssets = 0;
    let currentLiabilities = 0;
    let totalAssets = 0;
    let totalEquity = 0;

    if (state.settings.viewMode === 'current') {
      const { balanceSheet } = state.financialReports;
      
      if (balanceSheet && balanceSheet.fiscalYear === state.settings.currentFiscalYear) {
        if (balanceSheet.totalAssets && typeof balanceSheet.totalAssets === 'number') {
          totalAssets = balanceSheet.totalAssets;
          currentAssets = totalAssets * 0.6;
        } else if (balanceSheet.assets && typeof balanceSheet.assets === 'object') {
          totalAssets = Object.values(balanceSheet.assets).reduce((sum, item) => {
            const value = typeof item === 'object' ? (parseFloat(item.value) || 0) : (parseFloat(item) || 0);
            return sum + value;
          }, 0);
          currentAssets = totalAssets * 0.6;
        }

        if (balanceSheet.totalLiabilities && typeof balanceSheet.totalLiabilities === 'number') {
          currentLiabilities = balanceSheet.totalLiabilities;
        } else if (balanceSheet.liabilities && typeof balanceSheet.liabilities === 'object') {
          currentLiabilities = Object.values(balanceSheet.liabilities).reduce((sum, item) => {
            const value = typeof item === 'object' ? (parseFloat(item.value) || 0) : (parseFloat(item) || 0);
            return sum + value;
          }, 0);
        }

        if (balanceSheet.totalEquity && typeof balanceSheet.totalEquity === 'number') {
          totalEquity = balanceSheet.totalEquity;
        } else if (balanceSheet.equity && typeof balanceSheet.equity === 'object') {
          totalEquity = Object.values(balanceSheet.equity).reduce((sum, item) => {
            const value = typeof item === 'object' ? (parseFloat(item.value) || 0) : (parseFloat(item) || 0);
            return sum + value;
          }, 0);
        }
      }
    }

    const currentRatio = currentLiabilities > 0 ? currentAssets / currentLiabilities : 0;
    const debtToEquity = totalEquity > 0 ? currentLiabilities / totalEquity : 0;
    const roePercent = totalEquity > 0 ? (netProfit / totalEquity) * 100 : 0;

    const hasUploadedData = state.settings.viewMode === 'allTime'
      ? Object.values(state.historicalData).some(yearData =>
          yearData.profitLoss || yearData.balanceSheet || yearData.bankTransactions
        )
      : !!(
          (state.financialReports.profitLoss && state.financialReports.profitLoss.fiscalYear === state.settings.currentFiscalYear) ||
          (state.financialReports.balanceSheet && state.financialReports.balanceSheet.fiscalYear === state.settings.currentFiscalYear) ||
          (state.financialReports.bankTransactions && state.financialReports.bankTransactions.fiscalYear === state.settings.currentFiscalYear)
        );

    const metrics = {
      totalRevenue,
      totalCosts,
      grossProfit,
      corporationTax,
      netProfit,
      profitMargin,
      currentAssets,
      currentLiabilities,
      totalAssets,
      totalEquity,
      currentRatio,
      debtToEquity,
      roePercent,
      hasUploadedData
    };

    console.log('===FINAL METRICS===');
    console.log('View Mode:', state.settings.viewMode);
    console.log('Fiscal Year:', state.settings.currentFiscalYear);
    console.log('Revenue:', totalRevenue);
    console.log('Costs:', totalCosts);
    console.log('Profit:', grossProfit);

    return metrics;
  };

  const getAvailableFiscalYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    
    for (let i = 0; i < 6; i++) {
      years.push(currentYear - i);
    }
    
    Object.keys(state.historicalData).forEach(year => {
      const yearNum = parseInt(year);
      if (!years.includes(yearNum)) {
        years.push(yearNum);
      }
    });
    
    return years.sort((a, b) => b - a);
  };

  const value = {
    state,
    dispatch,
    calculateMetrics,
    getAvailableFiscalYears
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};