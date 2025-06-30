import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useFinance } from '../context/FinanceContext';

const { FiTrendingUp, FiAlertTriangle, FiCheckCircle, FiInfo, FiDollarSign, FiTarget, FiShield, FiClock } = FiIcons;

const Advice = () => {
  const { state, calculateMetrics } = useFinance();
  const metrics = calculateMetrics();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: state.settings.currency
    }).format(amount);
  };

  const getAdviceItems = () => {
    const advice = [];

    // Enhanced advice based on uploaded data
    if (metrics.hasUploadedData) {
      advice.push({
        type: 'success',
        title: 'Financial Data Integration Complete',
        description: `Your uploaded financial reports for FY ${state.settings.currentFiscalYear} are now integrated with dashboard metrics.`,
        action: 'Review updated calculations and consider year-over-year comparisons',
        priority: 'low'
      });
    }

    // Profit Margin Analysis
    if (metrics.profitMargin < 10) {
      advice.push({
        type: 'warning',
        title: 'Low Profit Margin',
        description: 'Your profit margin is below 10%. Consider reviewing your pricing strategy or reducing costs.',
        action: 'Review pricing and cost structure',
        priority: 'high'
      });
    } else if (metrics.profitMargin > 30) {
      advice.push({
        type: 'success',
        title: 'Excellent Profit Margin',
        description: 'Your profit margin is above 30%. Consider reinvesting in growth or building reserves.',
        action: 'Consider growth investments',
        priority: 'low'
      });
    }

    // Tax Planning with fiscal year awareness
    if (metrics.corporationTax > 0) {
      const fiscalYearEnd = `${state.settings.fiscalYearStart} ${state.settings.currentFiscalYear + 1}`;
      advice.push({
        type: 'info',
        title: 'Corporation Tax Planning',
        description: `You have £${metrics.corporationTax.toFixed(2)} in corporation tax due for FY ${state.settings.currentFiscalYear}. Tax payments are typically due by ${fiscalYearEnd}.`,
        action: `Save ${formatCurrency(metrics.corporationTax * 1.1)} for tax payments`,
        priority: 'high'
      });
    }

    // Financial Ratios Analysis (when balance sheet data is available)
    if (metrics.currentRatio > 0) {
      if (metrics.currentRatio < 1) {
        advice.push({
          type: 'warning',
          title: 'Low Liquidity Ratio',
          description: `Your current ratio of ${metrics.currentRatio.toFixed(1)} indicates potential cash flow issues.`,
          action: 'Improve cash management and reduce short-term liabilities',
          priority: 'high'
        });
      } else if (metrics.currentRatio > 3) {
        advice.push({
          type: 'info',
          title: 'Excess Liquidity',
          description: `Your current ratio of ${metrics.currentRatio.toFixed(1)} suggests you may have too much idle cash.`,
          action: 'Consider investing excess cash or expanding operations',
          priority: 'medium'
        });
      }
    }

    // Debt-to-Equity Analysis
    if (metrics.debtToEquity > 2) {
      advice.push({
        type: 'warning',
        title: 'High Debt Levels',
        description: `Your debt-to-equity ratio of ${metrics.debtToEquity.toFixed(1)} indicates high leverage.`,
        action: 'Focus on debt reduction and improving equity position',
        priority: 'high'
      });
    }

    // Cash Flow Analysis
    const monthlyRevenue = metrics.totalRevenue / 12;
    const monthlyCosts = metrics.totalCosts / 12;
    const monthlyProfit = monthlyRevenue - monthlyCosts;

    if (monthlyProfit < 0) {
      advice.push({
        type: 'warning',
        title: 'Negative Monthly Cash Flow',
        description: 'Your monthly costs exceed revenue. Immediate action required.',
        action: 'Reduce costs or increase revenue urgently',
        priority: 'critical'
      });
    }

    // Revenue Diversification
    const retainerCount = state.clients.filter(c => c.type === 'retainer').length;
    const projectCount = state.projects.length;

    if (retainerCount === 0 && projectCount > 0) {
      advice.push({
        type: 'info',
        title: 'Consider Recurring Revenue',
        description: 'All your revenue comes from one-off projects. Consider offering retainer services for stable income.',
        action: 'Develop retainer service offerings',
        priority: 'medium'
      });
    }

    return advice;
  };

  const adviceItems = getAdviceItems();

  const getAdviceIcon = (type) => {
    switch (type) {
      case 'warning': return FiAlertTriangle;
      case 'success': return FiCheckCircle;
      case 'info': return FiInfo;
      default: return FiInfo;
    }
  };

  const getAdviceColor = (type) => {
    switch (type) {
      case 'warning': return 'red';
      case 'success': return 'green';
      case 'info': return 'blue';
      default: return 'blue';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-900 text-red-200';
      case 'high': return 'bg-orange-900 text-orange-200';
      case 'medium': return 'bg-yellow-900 text-yellow-200';
      case 'low': return 'bg-green-900 text-green-200';
      default: return 'bg-slate-700 text-slate-300';
    }
  };

  const recommendations = [
    {
      category: 'Tax Optimization',
      icon: FiShield,
      items: [
        `Set up a separate savings account for corporation tax (FY ${state.settings.currentFiscalYear})`,
        'Consider pension contributions to reduce taxable profits',
        'Review eligible business expenses and deductions',
        'Plan major purchases before fiscal year-end for tax benefits'
      ]
    },
    {
      category: 'Cash Flow Management',
      icon: FiDollarSign,
      items: [
        'Maintain 3-6 months of expenses as emergency fund',
        'Implement strict payment terms with clients',
        'Consider invoice factoring for improved cash flow',
        'Monitor and forecast cash flow monthly'
      ]
    },
    {
      category: 'Growth Strategies',
      icon: FiTrendingUp,
      items: [
        'Diversify service offerings to reduce risk',
        'Develop recurring revenue streams',
        'Invest in marketing to attract higher-value clients',
        'Consider strategic partnerships or acquisitions'
      ]
    },
    {
      category: 'Risk Management',
      icon: FiTarget,
      items: [
        'Ensure adequate professional indemnity insurance',
        'Diversify client base to reduce dependency',
        'Create detailed contracts with clear scope',
        'Build strong relationships with key clients'
      ]
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Financial Advice</h1>
        <div className="text-slate-400 text-sm">
          FY {state.settings.currentFiscalYear}-{state.settings.currentFiscalYear + 1}
        </div>
      </div>

      {/* Personalized Advice */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-semibold text-white mb-6">Personalized Recommendations</h2>
        
        {adviceItems.length === 0 ? (
          <div className="text-center py-8">
            <SafeIcon icon={FiCheckCircle} className="text-green-400 text-4xl mx-auto mb-4" />
            <p className="text-slate-300">Your financial metrics look good! Keep monitoring regularly.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {adviceItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-700 rounded-lg p-4 border border-slate-600"
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-2 bg-${getAdviceColor(item.type)}-600 rounded-lg flex-shrink-0`}>
                    <SafeIcon icon={getAdviceIcon(item.type)} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-white">{item.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                      </span>
                    </div>
                    <p className="text-slate-300 text-sm mb-2">{item.description}</p>
                    <p className="text-blue-400 text-sm font-medium">
                      💡 {item.action}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* General Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {recommendations.map((category, index) => (
          <motion.div
            key={category.category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="bg-slate-800 rounded-xl p-6 border border-slate-700"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-600 rounded-lg">
                <SafeIcon icon={category.icon} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">{category.category}</h3>
            </div>
            <ul className="space-y-2">
              {category.items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-start space-x-2 text-slate-300 text-sm">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* Enhanced Financial Health Score */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-semibold text-white mb-6">Financial Health Score</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-2">
              <div className="w-full h-full bg-slate-700 rounded-full"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-green-400">
                  {metrics.hasUploadedData ? '92' : '85'}
                </span>
              </div>
            </div>
            <div className="text-slate-300 text-sm font-medium">Overall Score</div>
            <div className="text-green-400 text-xs">
              {metrics.hasUploadedData ? 'Excellent' : 'Very Good'}
            </div>
          </div>

          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-2">
              <div className="w-full h-full bg-slate-700 rounded-full"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-blue-400">
                  {Math.round(metrics.profitMargin > 20 ? 85 : metrics.profitMargin > 10 ? 70 : 45)}
                </span>
              </div>
            </div>
            <div className="text-slate-300 text-sm font-medium">Profitability</div>
            <div className="text-blue-400 text-xs">
              {metrics.profitMargin > 20 ? 'Excellent' : metrics.profitMargin > 10 ? 'Good' : 'Needs Work'}
            </div>
          </div>

          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-2">
              <div className="w-full h-full bg-slate-700 rounded-full"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-yellow-400">
                  {metrics.currentRatio > 0 
                    ? Math.round(metrics.currentRatio > 1.5 ? 85 : 65)
                    : 65
                  }
                </span>
              </div>
            </div>
            <div className="text-slate-300 text-sm font-medium">Liquidity</div>
            <div className="text-yellow-400 text-xs">
              {metrics.currentRatio > 1.5 ? 'Good' : 'Fair'}
            </div>
          </div>

          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-2">
              <div className="w-full h-full bg-slate-700 rounded-full"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-green-400">92</span>
              </div>
            </div>
            <div className="text-slate-300 text-sm font-medium">Growth</div>
            <div className="text-green-400 text-xs">Excellent</div>
          </div>
        </div>
      </div>

      {/* Next Steps with Fiscal Year Context */}
      <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-6 border border-blue-500/30">
        <div className="flex items-center space-x-3 mb-4">
          <SafeIcon icon={FiClock} className="text-blue-400 text-xl" />
          <h2 className="text-xl font-semibold text-white">Recommended Next Steps</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <h4 className="font-medium text-white mb-2">This Week</h4>
            <ul className="text-slate-300 text-sm space-y-1">
              <li>• Review FY {state.settings.currentFiscalYear} data accuracy</li>
              <li>• Set up tax savings account</li>
              <li>• Update financial records</li>
            </ul>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <h4 className="font-medium text-white mb-2">This Month</h4>
            <ul className="text-slate-300 text-sm space-y-1">
              <li>• Compare with previous fiscal year</li>
              <li>• Plan Q4 tax strategies</li>
              <li>• Review insurance coverage</li>
            </ul>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <h4 className="font-medium text-white mb-2">This Quarter</h4>
            <ul className="text-slate-300 text-sm space-y-1">
              <li>• Prepare for FY {state.settings.currentFiscalYear + 1}</li>
              <li>• Create annual cash flow forecast</li>
              <li>• Consider growth investments</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Advice;