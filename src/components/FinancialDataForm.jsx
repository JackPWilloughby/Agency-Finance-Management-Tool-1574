import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useFinance } from '../context/FinanceContext';

const { FiX, FiSave, FiPlus, FiTrash2, FiFileText, FiCalendar } = FiIcons;

const FinancialDataForm = ({ type, onClose, editingData }) => {
  const { state, dispatch } = useFinance();
  
  console.log('🔄 FinancialDataForm received editingData:', editingData);
  
  // Generate fiscal year months based on settings
  const getFiscalYearMonths = () => {
    const allMonths = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const monthAbbreviations = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    const fiscalStartMonth = state.settings.fiscalYearStart;
    const startIndex = allMonths.indexOf(fiscalStartMonth);
    
    if (startIndex === -1) return monthAbbreviations; // Fallback to calendar year
    
    // Create fiscal year month order
    const fiscalMonths = [];
    for (let i = 0; i < 12; i++) {
      const monthIndex = (startIndex + i) % 12;
      fiscalMonths.push(monthAbbreviations[monthIndex]);
    }
    
    return fiscalMonths;
  };

  const months = getFiscalYearMonths();

  // Initialize form data based on type and editing data
  const getInitialFormData = () => {
    console.log('🔄 Getting initial form data - editingData:', editingData);
    console.log('🔄 Type:', type);
    console.log('🔄 Months:', months);
    
    if (editingData) {
      console.log('📝 EDITING MODE - Loading existing data');
      console.log('📝 editingData structure:', JSON.stringify(editingData, null, 2));
      
      if (type === 'profitLoss') {
        const revenue = [];
        const expenses = [];
        
        // Process existing revenue data
        if (editingData.revenue && typeof editingData.revenue === 'object') {
          console.log('📊 Processing revenue data:', editingData.revenue);
          Object.entries(editingData.revenue).forEach(([key, item]) => {
            console.log('📊 Processing revenue item:', key, item);
            
            const revenueItem = {
              name: item.name || '',
              notes: item.notes || '',
              ...Object.fromEntries(months.map(m => [m, '']))
            };
            
            // Populate monthly breakdown if available
            if (item.monthlyBreakdown && typeof item.monthlyBreakdown === 'object') {
              console.log('📅 Found monthly breakdown:', item.monthlyBreakdown);
              months.forEach(month => {
                if (item.monthlyBreakdown[month] !== undefined && item.monthlyBreakdown[month] !== null) {
                  revenueItem[month] = item.monthlyBreakdown[month].toString();
                  console.log(`📅 Set ${month} = ${item.monthlyBreakdown[month]}`);
                }
              });
            } else if (item.value && item.value > 0) {
              // If no monthly breakdown, distribute total across months or put in first month
              console.log('📅 No monthly breakdown, using total value:', item.value);
              revenueItem[months[0]] = item.value.toString();
            }
            
            revenue.push(revenueItem);
            console.log('📊 Added revenue item:', revenueItem);
          });
        }
        
        // Process existing expense data
        if (editingData.expenses && typeof editingData.expenses === 'object') {
          console.log('💰 Processing expense data:', editingData.expenses);
          Object.entries(editingData.expenses).forEach(([key, item]) => {
            console.log('💰 Processing expense item:', key, item);
            
            const expenseItem = {
              name: item.name || '',
              notes: item.notes || '',
              ...Object.fromEntries(months.map(m => [m, '']))
            };
            
            // Populate monthly breakdown if available
            if (item.monthlyBreakdown && typeof item.monthlyBreakdown === 'object') {
              console.log('📅 Found monthly breakdown:', item.monthlyBreakdown);
              months.forEach(month => {
                if (item.monthlyBreakdown[month] !== undefined && item.monthlyBreakdown[month] !== null) {
                  expenseItem[month] = item.monthlyBreakdown[month].toString();
                  console.log(`📅 Set ${month} = ${item.monthlyBreakdown[month]}`);
                }
              });
            } else if (item.value && item.value > 0) {
              // If no monthly breakdown, put total in first month
              console.log('📅 No monthly breakdown, using total value:', item.value);
              expenseItem[months[0]] = item.value.toString();
            }
            
            expenses.push(expenseItem);
            console.log('💰 Added expense item:', expenseItem);
          });
        }
        
        // Ensure at least one row for each section
        if (revenue.length === 0) {
          console.log('📊 No revenue items found, adding empty row');
          revenue.push({ name: '', ...Object.fromEntries(months.map(m => [m, ''])), notes: '' });
        }
        if (expenses.length === 0) {
          console.log('💰 No expense items found, adding empty row');
          expenses.push({ name: '', ...Object.fromEntries(months.map(m => [m, ''])), notes: '' });
        }
        
        console.log('📝 Final P&L form data:', { revenue, expenses });
        return { revenue, expenses };
        
      } else if (type === 'balanceSheet') {
        const assets = [];
        const liabilities = [];
        const equity = [];
        
        // Process existing balance sheet data
        if (editingData.assets && typeof editingData.assets === 'object') {
          Object.entries(editingData.assets).forEach(([key, item]) => {
            assets.push({
              name: item.name || '',
              amount: item.value ? item.value.toString() : '',
              notes: item.notes || ''
            });
          });
        }
        
        if (editingData.liabilities && typeof editingData.liabilities === 'object') {
          Object.entries(editingData.liabilities).forEach(([key, item]) => {
            liabilities.push({
              name: item.name || '',
              amount: item.value ? item.value.toString() : '',
              notes: item.notes || ''
            });
          });
        }
        
        if (editingData.equity && typeof editingData.equity === 'object') {
          Object.entries(editingData.equity).forEach(([key, item]) => {
            equity.push({
              name: item.name || '',
              amount: item.value ? item.value.toString() : '',
              notes: item.notes || ''
            });
          });
        }
        
        // Ensure at least one row for each section
        if (assets.length === 0) assets.push({ name: '', amount: '', notes: '' });
        if (liabilities.length === 0) liabilities.push({ name: '', amount: '', notes: '' });
        if (equity.length === 0) equity.push({ name: '', amount: '', notes: '' });
        
        return { assets, liabilities, equity };
      }
    }
    
    // Default new data
    console.log('✨ Creating new data (not editing)');
    if (type === 'profitLoss') {
      return {
        revenue: [
          { name: 'Client Services Revenue', ...Object.fromEntries(months.map(m => [m, ''])), notes: 'Main service revenue' },
          { name: 'Consulting Revenue', ...Object.fromEntries(months.map(m => [m, ''])), notes: 'Consulting fees' },
          { name: 'Recurring Revenue', ...Object.fromEntries(months.map(m => [m, ''])), notes: 'Monthly retainers' }
        ],
        expenses: [
          { name: 'Salaries and Wages', ...Object.fromEntries(months.map(m => [m, ''])), notes: 'Employee salaries' },
          { name: 'Office Rent', ...Object.fromEntries(months.map(m => [m, ''])), notes: 'Monthly office rent' },
          { name: 'Marketing and Advertising', ...Object.fromEntries(months.map(m => [m, ''])), notes: 'Marketing campaigns' },
          { name: 'Professional Fees', ...Object.fromEntries(months.map(m => [m, ''])), notes: 'Legal and accounting' }
        ]
      };
    } else {
      return {
        assets: [{ name: '', amount: '', notes: '' }],
        liabilities: [{ name: '', amount: '', notes: '' }],
        equity: [{ name: '', amount: '', notes: '' }]
      };
    }
  };

  const [formData, setFormData] = useState(() => getInitialFormData());

  // Update form data when editingData changes
  useEffect(() => {
    console.log('🔄 useEffect triggered - editingData changed:', editingData);
    const newFormData = getInitialFormData();
    console.log('🔄 Setting new form data:', newFormData);
    setFormData(newFormData);
  }, [editingData, type, months.join(',')]);

  const getFormConfig = () => {
    const fiscalYearRange = `${state.settings.fiscalYearStart} ${state.settings.currentFiscalYear} - ${state.settings.fiscalYearStart} ${state.settings.currentFiscalYear + 1}`;
    
    switch (type) {
      case 'profitLoss':
        return {
          title: 'Profit & Loss Statement',
          subtitle: `Monthly Breakdown (${fiscalYearRange})`,
          sections: [
            { key: 'revenue', label: 'Revenue Items', color: 'green' },
            { key: 'expenses', label: 'Expense Items', color: 'red' }
          ]
        };
      case 'balanceSheet':
        return {
          title: 'Balance Sheet',
          subtitle: `Annual Summary (${fiscalYearRange})`,
          sections: [
            { key: 'assets', label: 'Assets', color: 'blue' },
            { key: 'liabilities', label: 'Liabilities', color: 'orange' },
            { key: 'equity', label: 'Equity', color: 'purple' }
          ]
        };
      default:
        return { title: 'Financial Data', sections: [] };
    }
  };

  const config = getFormConfig();

  const addItem = (section) => {
    if (type === 'profitLoss') {
      setFormData(prev => ({
        ...prev,
        [section]: [...prev[section], { 
          name: '', 
          ...Object.fromEntries(months.map(m => [m, ''])), 
          notes: '' 
        }]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [section]: [...prev[section], { name: '', amount: '', notes: '' }]
      }));
    }
  };

  const removeItem = (section, index) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  const updateItem = (section, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const calculateRowTotal = (item) => {
    if (type === 'profitLoss') {
      return months.reduce((sum, month) => {
        const amount = parseFloat(item[month]) || 0;
        return sum + amount;
      }, 0);
    }
    return parseFloat(item.amount) || 0;
  };

  const calculateSectionTotal = (section) => {
    return formData[section].reduce((sum, item) => sum + calculateRowTotal(item), 0);
  };

  const calculateMonthTotal = (section, month) => {
    return formData[section].reduce((sum, item) => {
      const amount = parseFloat(item[month]) || 0;
      return sum + amount;
    }, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log('🔥 SUBMITTING FINANCIAL DATA FOR FY', state.settings.currentFiscalYear);
    console.log('📅 Fiscal Year Months:', months);
    
    let processedData = {
      extractedAt: new Date().toISOString(),
      source: 'manual_form',
      fiscalYear: state.settings.currentFiscalYear,
      fiscalYearStart: state.settings.fiscalYearStart,
      fiscalMonthOrder: months
    };

    if (type === 'profitLoss') {
      const revenueData = {};
      const expenseData = {};
      let totalRevenue = 0;
      let totalExpenses = 0;

      // Process Revenue with fiscal year monthly breakdown
      formData.revenue.forEach((item, index) => {
        if (item.name) {
          const monthlyData = {};
          let itemTotal = 0;
          months.forEach(month => {
            const amount = parseFloat(item[month]) || 0;
            monthlyData[month] = amount;
            itemTotal += amount;
          });
          
          if (itemTotal > 0) {
            revenueData[`revenue_${index + 1}`] = {
              name: item.name,
              value: itemTotal,
              monthlyBreakdown: monthlyData,
              notes: item.notes || '',
              source: 'manual'
            };
            totalRevenue += itemTotal;
          }
        }
      });

      // Process Expenses with fiscal year monthly breakdown
      formData.expenses.forEach((item, index) => {
        if (item.name) {
          const monthlyData = {};
          let itemTotal = 0;
          months.forEach(month => {
            const amount = parseFloat(item[month]) || 0;
            monthlyData[month] = amount;
            itemTotal += amount;
          });
          
          if (itemTotal > 0) {
            expenseData[`expense_${index + 1}`] = {
              name: item.name,
              value: itemTotal,
              monthlyBreakdown: monthlyData,
              notes: item.notes || '',
              source: 'manual'
            };
            totalExpenses += itemTotal;
          }
        }
      });

      processedData = {
        ...processedData,
        revenue: revenueData,
        expenses: expenseData,
        totalRevenue,
        totalExpenses,
        monthlyTotals: {
          revenue: Object.fromEntries(months.map(month => [month, calculateMonthTotal('revenue', month)])),
          expenses: Object.fromEntries(months.map(month => [month, calculateMonthTotal('expenses', month)])),
          profit: Object.fromEntries(months.map(month => [month, calculateMonthTotal('revenue', month) - calculateMonthTotal('expenses', month)]))
        }
      };

    } else if (type === 'balanceSheet') {
      // Process Balance Sheet (yearly totals)
      const assetData = {};
      const liabilityData = {};
      const equityData = {};
      let totalAssets = 0;
      let totalLiabilities = 0;
      let totalEquity = 0;

      formData.assets.forEach((item, index) => {
        const amount = parseFloat(item.amount) || 0;
        if (item.name && amount > 0) {
          assetData[`asset_${index + 1}`] = {
            name: item.name,
            value: amount,
            notes: item.notes || '',
            source: 'manual'
          };
          totalAssets += amount;
        }
      });

      formData.liabilities.forEach((item, index) => {
        const amount = parseFloat(item.amount) || 0;
        if (item.name && amount > 0) {
          liabilityData[`liability_${index + 1}`] = {
            name: item.name,
            value: amount,
            notes: item.notes || '',
            source: 'manual'
          };
          totalLiabilities += amount;
        }
      });

      formData.equity.forEach((item, index) => {
        const amount = parseFloat(item.amount) || 0;
        if (item.name && amount !== 0) {
          equityData[`equity_${index + 1}`] = {
            name: item.name,
            value: amount,
            notes: item.notes || '',
            source: 'manual'
          };
          totalEquity += amount;
        }
      });

      processedData = {
        ...processedData,
        assets: assetData,
        liabilities: liabilityData,
        equity: equityData,
        totalAssets,
        totalLiabilities,
        totalEquity
      };
    }

    dispatch({
      type: 'UPLOAD_FINANCIAL_REPORT',
      payload: {
        type,
        data: processedData,
        fileName: `${type}-manual-entry-${new Date().toISOString().split('T')[0]}.json`
      }
    });

    onClose();
  };

  const loadSampleData = () => {
    if (type === 'profitLoss') {
      // Create sample data with fiscal year months
      const sampleRevenue = {
        name: 'Client Services Revenue',
        ...Object.fromEntries(months.map((month, index) => {
          // Sample pattern: higher in Q1 and Q4 of fiscal year
          const values = [1000, 999.77, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9997.42];
          return [month, values[index] || '0'];
        })),
        notes: 'Main service revenue'
      };

      const sampleRecurring = {
        name: 'Recurring Revenue',
        ...Object.fromEntries(months.map(month => [month, '2500'])),
        notes: 'Monthly retainers'
      };

      const sampleMarketing = {
        name: 'Marketing and Advertising',
        ...Object.fromEntries(months.map((month, index) => {
          // Marketing spend in last month of fiscal year
          return [month, index === 11 ? '881.99' : '0'];
        })),
        notes: 'Marketing campaigns'
      };

      const sampleSoftware = {
        name: 'Software Subscriptions',
        ...Object.fromEntries(months.map(month => [month, '21.41'])),
        notes: 'Business software'
      };

      setFormData({
        revenue: [
          sampleRevenue,
          { 
            name: 'Consulting Revenue', 
            ...Object.fromEntries(months.map(m => [m, '0'])),
            notes: 'Consulting fees' 
          },
          sampleRecurring
        ],
        expenses: [
          sampleMarketing,
          { 
            name: 'Professional Fees', 
            ...Object.fromEntries(months.map((month, index) => [month, index === 11 ? '430.61' : '0'])),
            notes: 'Legal and accounting' 
          },
          sampleSoftware,
          { 
            name: 'Equipment Depreciation', 
            ...Object.fromEntries(months.map(month => [month, '250'])),
            notes: 'Equipment depreciation' 
          }
        ]
      });
    } else if (type === 'balanceSheet') {
      setFormData({
        assets: [
          { name: 'Cash and Cash Equivalents', amount: '8224.08', notes: 'Bank accounts and cash' },
          { name: 'Accounts Receivable', amount: '700.00', notes: 'Outstanding client invoices' },
          { name: 'Office Equipment', amount: '20000.00', notes: 'Computers and office equipment' },
          { name: 'Furniture and Fixtures', amount: '8000.00', notes: 'Office furniture' },
          { name: 'Software Licenses', amount: '5000.00', notes: 'Intangible assets' }
        ],
        liabilities: [
          { name: 'Short-term Loans', amount: '5000.00', notes: 'Credit lines and short-term debt' }
        ],
        equity: [
          { name: 'Retained Earnings', amount: '8924.08', notes: 'Accumulated profits' }
        ]
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 50 }}
        className="bg-slate-800 rounded-xl w-full max-w-7xl border border-slate-700 shadow-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fixed Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <SafeIcon icon={type === 'profitLoss' ? FiCalendar : FiFileText} className="text-blue-400 text-xl" />
            <div>
              <h2 className="text-xl font-semibold text-white">
                {editingData ? 'Edit' : 'Create'} {config.title}
              </h2>
              <p className="text-slate-400 text-sm">{config.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {!editingData && (
              <motion.button
                onClick={loadSampleData}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Load Sample Data
              </motion.button>
            )}
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <SafeIcon icon={FiX} className="text-xl" />
            </button>
          </div>
        </div>

        {/* Fiscal Year Info Banner */}
        <div className="bg-blue-900/30 border-b border-blue-500/30 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="text-blue-200 text-sm">
              <span className="font-medium">Fiscal Year:</span> {state.settings.fiscalYearStart} {state.settings.currentFiscalYear} - {state.settings.fiscalYearStart} {state.settings.currentFiscalYear + 1}
            </div>
            <div className="text-blue-300 text-xs">
              Months: {months.join(' → ')}
            </div>
          </div>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-auto">
          <form onSubmit={handleSubmit} className="p-6">
            {config.sections.map((section) => (
              <div key={section.key} className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-green-400">
                    {section.label}
                  </h3>
                  <div className="flex items-center space-x-3">
                    <span className="text-slate-400 text-sm">
                      Total: £{calculateSectionTotal(section.key).toLocaleString()}
                    </span>
                    <motion.button
                      type="button"
                      onClick={() => addItem(section.key)}
                      className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <SafeIcon icon={FiPlus} className="text-sm" />
                    </motion.button>
                  </div>
                </div>

                {type === 'profitLoss' ? (
                  // Monthly Table Layout for P&L with Fiscal Year Months
                  <div className="overflow-x-auto">
                    <table className="w-full bg-slate-700 rounded-lg border border-slate-600">
                      <thead>
                        <tr className="border-b border-slate-600">
                          <th className="text-left p-3 text-slate-300 font-medium w-48">Account</th>
                          {months.map(month => (
                            <th key={month} className="text-center p-2 text-slate-300 font-medium w-20">
                              {month}
                            </th>
                          ))}
                          <th className="text-center p-3 text-slate-300 font-medium w-24">Total</th>
                          <th className="text-center p-3 text-slate-300 font-medium w-16">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData[section.key] && formData[section.key].map((item, index) => (
                          <motion.tr
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="border-b border-slate-600 last:border-b-0 hover:bg-slate-600/50"
                          >
                            <td className="p-3">
                              <input
                                type="text"
                                placeholder="Account name"
                                value={item.name || ''}
                                onChange={(e) => updateItem(section.key, index, 'name', e.target.value)}
                                className="w-full px-2 py-1 bg-slate-600 border border-slate-500 rounded text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                                required
                              />
                            </td>
                            {months.map(month => (
                              <td key={month} className="p-2">
                                <input
                                  type="number"
                                  placeholder="0"
                                  step="0.01"
                                  min="0"
                                  value={item[month] || ''}
                                  onChange={(e) => updateItem(section.key, index, month, e.target.value)}
                                  className="w-full px-1 py-1 bg-slate-600 border border-slate-500 rounded text-white text-center text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                              </td>
                            ))}
                            <td className="p-3 text-center">
                              <span className="text-white font-semibold">
                                £{calculateRowTotal(item).toLocaleString()}
                              </span>
                            </td>
                            <td className="p-3 text-center">
                              {formData[section.key].length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeItem(section.key, index)}
                                  className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-slate-600 transition-colors"
                                >
                                  <SafeIcon icon={FiTrash2} className="text-sm" />
                                </button>
                              )}
                            </td>
                          </motion.tr>
                        ))}
                        {/* Monthly Totals Row */}
                        <tr className="bg-green-600/20 border-t-2 border-green-500">
                          <td className="p-3 font-semibold text-white">
                            Monthly Totals
                          </td>
                          {months.map(month => (
                            <td key={month} className="p-2 text-center">
                              <span className="text-green-300 font-semibold text-xs">
                                £{calculateMonthTotal(section.key, month).toLocaleString()}
                              </span>
                            </td>
                          ))}
                          <td className="p-3 text-center">
                            <span className="text-green-300 font-bold text-lg">
                              £{calculateSectionTotal(section.key).toLocaleString()}
                            </span>
                          </td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : (
                  // Simple Layout for Balance Sheet
                  <div className="space-y-3">
                    {formData[section.key] && formData[section.key].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 bg-slate-700 rounded-lg border border-slate-600"
                      >
                        <div className="md:col-span-4">
                          <input
                            type="text"
                            placeholder="Item name"
                            value={item.name || ''}
                            onChange={(e) => updateItem(section.key, index, 'name', e.target.value)}
                            className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            required
                          />
                        </div>
                        <div className="md:col-span-3">
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm">£</span>
                            <input
                              type="number"
                              placeholder="0.00"
                              step="0.01"
                              min={section.key === 'equity' ? undefined : "0"}
                              value={item.amount || ''}
                              onChange={(e) => updateItem(section.key, index, 'amount', e.target.value)}
                              className="w-full pl-8 pr-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              required
                            />
                          </div>
                        </div>
                        <div className="md:col-span-4">
                          <input
                            type="text"
                            placeholder="Notes (optional)"
                            value={item.notes || ''}
                            onChange={(e) => updateItem(section.key, index, 'notes', e.target.value)}
                            className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          />
                        </div>
                        <div className="md:col-span-1 flex justify-center">
                          {formData[section.key].length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeItem(section.key, index)}
                              className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-slate-600 transition-colors"
                            >
                              <SafeIcon icon={FiTrash2} className="text-sm" />
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </form>
        </div>

        {/* Fixed Footer */}
        <div className="border-t border-slate-700 p-6 flex-shrink-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-slate-400 text-sm">
              <p>Financial data for Fiscal Year {state.settings.currentFiscalYear} ({state.settings.fiscalYearStart} to {state.settings.fiscalYearStart})</p>
              {type === 'profitLoss' && (
                <p>Annual Net Profit: £{(calculateSectionTotal('revenue') - calculateSectionTotal('expenses')).toLocaleString()}</p>
              )}
              {type === 'balanceSheet' && (
                <p>Total: Assets £{calculateSectionTotal('assets').toLocaleString()} | Liab. £{calculateSectionTotal('liabilities').toLocaleString()} | Equity £{calculateSectionTotal('equity').toLocaleString()}</p>
              )}
            </div>
            <div className="flex flex-col-reverse sm:flex-row justify-end space-y-2 space-y-reverse sm:space-y-0 sm:space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors text-center"
              >
                Cancel
              </button>
              <motion.button
                type="submit"
                onClick={handleSubmit}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <SafeIcon icon={FiSave} />
                <span>{editingData ? 'Update' : 'Save'} {config.title}</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FinancialDataForm;