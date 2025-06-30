import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useFinance } from '../context/FinanceContext';
import MetricCard from '../components/MetricCard';
import RevenueChart from '../components/RevenueChart';
import CashFlowChart from '../components/CashFlowChart';
import FiscalYearSettings from '../components/FiscalYearSettings';

const { FiDollarSign, FiTrendingUp, FiTrendingDown, FiPieChart, FiInfo } = FiIcons;

const Dashboard = () => {
  const { state, calculateMetrics } = useFinance();
  const metrics = calculateMetrics();

  const formatCurrency = (amount) => {
    if (isNaN(amount) || amount === null || amount === undefined) {
      return '£0.00';
    }
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: state.settings.currency
    }).format(amount);
  };

  const formatCurrencyCompact = (amount) => {
    if (isNaN(amount) || amount === null || amount === undefined) {
      return '£0';
    }
    if (amount >= 1000000) {
      return `£${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `£${(amount / 1000).toFixed(1)}k`;
    }
    return formatCurrency(amount);
  };

  const formatPercentage = (value) => {
    if (isNaN(value) || value === null || value === undefined) {
      return '0.0%';
    }
    return `${value.toFixed(1)}%`;
  };

  const hasAnyData = state.clients.length > 0 || 
                    state.projects.length > 0 || 
                    Object.values(state.costs).some(arr => arr.length > 0) || 
                    metrics.hasUploadedData;

  const getViewModeTitle = () => {
    if (state.settings.viewMode === 'allTime') {
      return 'All Time Financial Overview';
    }
    return `FY ${state.settings.currentFiscalYear}`;
  };

  const getViewModeSubtitle = () => {
    if (state.settings.viewMode === 'allTime') {
      return 'Combined data from all fiscal years';
    }
    return `${state.settings.fiscalYearStart} ${state.settings.currentFiscalYear} - ${state.settings.fiscalYearStart} ${state.settings.currentFiscalYear + 1}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4 lg:space-y-6 p-4 lg:p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 text-sm">{getViewModeSubtitle()}</p>
        </div>
        <FiscalYearSettings />
      </div>

      {/* Data Source Alert */}
      {metrics.hasUploadedData && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-900/50 border border-blue-500/30 rounded-xl p-4"
        >
          <div className="flex items-center space-x-3">
            <SafeIcon icon={FiInfo} className="text-blue-400" />
            <div>
              <p className="text-blue-200 text-sm font-medium">
                {state.settings.viewMode === 'allTime' 
                  ? 'Using All Historical Financial Data'
                  : 'Using Uploaded Financial Data'
                }
              </p>
              <p className="text-blue-300 text-xs">
                {state.settings.viewMode === 'allTime'
                  ? 'Dashboard metrics include all uploaded reports and manual entries across all years'
                  : `Dashboard metrics include uploaded reports for FY ${state.settings.currentFiscalYear}`
                }
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Getting Started Alert */}
      {!hasAnyData && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-500/30 rounded-xl p-6 text-center"
        >
          <div className="max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold text-white mb-3">Welcome to Agency Finance</h2>
            <p className="text-blue-200 text-sm mb-4">
              Get started by uploading your financial documents or manually adding clients and projects to see your financial metrics.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="bg-slate-800/50 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">📄 Upload Documents</h3>
                <p className="text-slate-300 text-xs">Upload P&L, Balance Sheet, or bank statements</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">👥 Add Clients</h3>
                <p className="text-slate-300 text-xs">Add retainer clients and one-off projects</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">💰 Track Costs</h3>
                <p className="text-slate-300 text-xs">Add team, marketing, and operational costs</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        <MetricCard
          title="Revenue"
          value={formatCurrencyCompact(metrics.totalRevenue)}
          icon={FiDollarSign}
          trend={metrics.totalRevenue > 0 ? 'up' : 'neutral'}
          bgColor="bg-green-600"
          subtitle={getViewModeTitle()}
          compact={true}
        />
        <MetricCard
          title="Costs"
          value={formatCurrencyCompact(metrics.totalCosts)}
          icon={FiTrendingDown}
          trend="down"
          bgColor="bg-red-600"
          subtitle={getViewModeTitle()}
          compact={true}
        />
        <MetricCard
          title="Profit"
          value={formatCurrencyCompact(metrics.grossProfit)}
          icon={FiTrendingUp}
          trend={metrics.grossProfit > 0 ? 'up' : 'down'}
          bgColor="bg-blue-600"
          subtitle={getViewModeTitle()}
          compact={true}
        />
        <MetricCard
          title="Margin"
          value={formatPercentage(metrics.profitMargin)}
          icon={FiPieChart}
          trend={metrics.profitMargin > 20 ? 'up' : metrics.profitMargin > 10 ? 'neutral' : 'down'}
          bgColor="bg-purple-600"
          subtitle={getViewModeTitle()}
          compact={true}
        />
      </div>

      {/* Show additional sections only when there's data */}
      {hasAnyData && (
        <>
          {/* Tax Information - only show for current year view */}
          {state.settings.viewMode === 'current' && (
            <div className="bg-slate-800 rounded-xl p-4 lg:p-6 border border-slate-700">
              <h2 className="text-lg lg:text-xl font-semibold text-white mb-4">
                Tax Planning - FY {state.settings.currentFiscalYear}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                <div className="bg-slate-700 rounded-lg p-3 lg:p-4">
                  <h3 className="text-slate-300 text-xs lg:text-sm font-medium mb-2">Corporation Tax Due</h3>
                  <p className="text-lg lg:text-2xl font-bold text-orange-400">
                    {formatCurrencyCompact(metrics.corporationTax)}
                  </p>
                  <p className="text-slate-400 text-xs mt-1">
                    @ {(state.settings.corporationTaxRate * 100)}% rate
                  </p>
                </div>
                <div className="bg-slate-700 rounded-lg p-3 lg:p-4">
                  <h3 className="text-slate-300 text-xs lg:text-sm font-medium mb-2">Net Profit After Tax</h3>
                  <p className="text-lg lg:text-2xl font-bold text-green-400">
                    {formatCurrencyCompact(metrics.netProfit)}
                  </p>
                </div>
                <div className="bg-slate-700 rounded-lg p-3 lg:p-4">
                  <h3 className="text-slate-300 text-xs lg:text-sm font-medium mb-2">Recommended Savings</h3>
                  <p className="text-lg lg:text-2xl font-bold text-blue-400">
                    {formatCurrencyCompact(metrics.corporationTax * 1.1)}
                  </p>
                  <p className="text-slate-400 text-xs mt-1">
                    110% of tax liability
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Financial Ratios (when balance sheet data is available and current year) */}
          {state.settings.viewMode === 'current' && (metrics.currentRatio > 0 || metrics.debtToEquity > 0 || metrics.roePercent !== 0) && (
            <div className="bg-slate-800 rounded-xl p-4 lg:p-6 border border-slate-700">
              <h2 className="text-lg lg:text-xl font-semibold text-white mb-4">
                Key Financial Ratios - FY {state.settings.currentFiscalYear}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                {metrics.currentRatio > 0 && (
                  <div className="bg-slate-700 rounded-lg p-3 lg:p-4 text-center">
                    <p className="text-2xl font-bold text-blue-400 mb-1">
                      {metrics.currentRatio.toFixed(1)}
                    </p>
                    <p className="text-slate-300 text-sm font-medium">Current Ratio</p>
                    <p className="text-slate-500 text-xs">Current Assets / Current Liabilities</p>
                  </div>
                )}
                {metrics.debtToEquity > 0 && (
                  <div className="bg-slate-700 rounded-lg p-3 lg:p-4 text-center">
                    <p className="text-2xl font-bold text-purple-400 mb-1">
                      {metrics.debtToEquity.toFixed(1)}
                    </p>
                    <p className="text-slate-300 text-sm font-medium">Debt-to-Equity</p>
                    <p className="text-slate-500 text-xs">Total Debt / Total Equity</p>
                  </div>
                )}
                {metrics.roePercent !== 0 && (
                  <div className="bg-slate-700 rounded-lg p-3 lg:p-4 text-center">
                    <p className="text-2xl font-bold text-orange-400 mb-1">
                      {formatPercentage(metrics.roePercent)}
                    </p>
                    <p className="text-slate-300 text-sm font-medium">ROE</p>
                    <p className="text-slate-500 text-xs">Return on Equity</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            <div className="bg-slate-800 rounded-xl p-4 lg:p-6 border border-slate-700">
              <h2 className="text-lg lg:text-xl font-semibold text-white mb-4">Revenue Overview</h2>
              <div className="h-64 lg:h-80">
                <RevenueChart />
              </div>
            </div>
            <div className="bg-slate-800 rounded-xl p-4 lg:p-6 border border-slate-700">
              <h2 className="text-lg lg:text-xl font-semibold text-white mb-4">Cash Flow Forecast</h2>
              <div className="h-64 lg:h-80">
                <CashFlowChart />
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            <div className="bg-slate-800 rounded-xl p-4 lg:p-6 border border-slate-700">
              <h3 className="text-base lg:text-lg font-semibold text-white mb-3">Active Clients</h3>
              <p className="text-2xl lg:text-3xl font-bold text-blue-400">
                {state.clients.length}
              </p>
              <p className="text-slate-400 text-xs lg:text-sm mt-1">
                {state.clients.filter(c => c.type === 'retainer').length} retainers
              </p>
            </div>
            <div className="bg-slate-800 rounded-xl p-4 lg:p-6 border border-slate-700">
              <h3 className="text-base lg:text-lg font-semibold text-white mb-3">Active Projects</h3>
              <p className="text-2xl lg:text-3xl font-bold text-green-400">
                {state.projects.length}
              </p>
              <p className="text-slate-400 text-xs lg:text-sm mt-1">
                One-time projects
              </p>
            </div>
            <div className="bg-slate-800 rounded-xl p-4 lg:p-6 border border-slate-700">
              <h3 className="text-base lg:text-lg font-semibold text-white mb-3">Monthly Recurring</h3>
              <p className="text-2xl lg:text-3xl font-bold text-purple-400">
                {formatCurrencyCompact(
                  state.clients
                    .filter(c => c.type === 'retainer')
                    .reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0)
                )}
              </p>
              <p className="text-slate-400 text-xs lg:text-sm mt-1">
                From retainer clients
              </p>
            </div>
          </div>
        </>
      )}

      {/* Debug Info - Only show when there's data */}
      {hasAnyData && (
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <h3 className="text-white font-semibold mb-2">Data Summary</h3>
          <div className="text-xs text-slate-400 space-y-1">
            <p>View Mode: {state.settings.viewMode === 'allTime' ? 'All Time Combined' : `Current FY ${state.settings.currentFiscalYear}`}</p>
            <p>Data Sources: {[
              state.financialReports.profitLoss && 'P&L',
              state.financialReports.balanceSheet && 'Balance Sheet',
              state.financialReports.bankTransactions && 'Bank Transactions'
            ].filter(Boolean).join(', ') || 'Manual entries only'}</p>
            <p>Manual Entries: {state.clients.length} clients, {state.projects.length} projects, {Object.values(state.costs).flat().length} costs</p>
            <p>Total Revenue: {formatCurrency(metrics.totalRevenue)}</p>
            <p>Total Costs: {formatCurrency(metrics.totalCosts)}</p>
            <p>Gross Profit: {formatCurrency(metrics.grossProfit)}</p>
            {state.settings.viewMode === 'current' && (
              <p>Current Fiscal Year: {state.settings.currentFiscalYear}</p>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Dashboard;