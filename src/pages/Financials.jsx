import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useFinance } from '../context/FinanceContext';
import FinancialDataForm from '../components/FinancialDataForm';
import FiscalYearSettings from '../components/FiscalYearSettings';

const { FiPlus, FiFileText, FiDownload, FiEye, FiAlertCircle, FiTrash2, FiEdit } = FiIcons;

const Financials = () => {
  const { state, dispatch, calculateMetrics } = useFinance();
  const [showDataForm, setShowDataForm] = useState({ show: false, type: null, editingData: null });
  const metrics = calculateMetrics();

  const handleDeleteReport = (type) => {
    if (window.confirm(`Are you sure you want to delete this financial report for FY ${state.settings.currentFiscalYear}? This action cannot be undone.`)) {
      dispatch({ type: 'DELETE_FINANCIAL_REPORT', payload: type });
    }
  };

  const handleEditReport = (type, report) => {
    console.log('📝 Editing report:', type, report);
    setShowDataForm({ show: true, type, editingData: report });
  };

  const exportData = () => {
    const dataStr = JSON.stringify(state, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `agency-finance-backup-${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all financial data? This action cannot be undone.')) {
      dispatch({ type: 'CLEAR_ALL_DATA' });
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: state.settings.currency
    }).format(amount);
  };

  const getFiscalYearDateRange = () => {
    const currentYear = state.settings.currentFiscalYear;
    const startMonth = state.settings.fiscalYearStart;
    const endYear = currentYear + 1;
    return `${startMonth} ${currentYear} - ${startMonth} ${endYear}`;
  };

  const CreateReportCard = ({ type, title, description, icon, color }) => (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-3 bg-${color}-600 rounded-lg`}>
            <SafeIcon icon={icon} className="text-white text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="text-slate-400 text-sm">{description}</p>
          </div>
        </div>
      </div>
      <div className="text-center py-8">
        <SafeIcon icon={FiPlus} className="text-slate-500 text-3xl mx-auto mb-4" />
        <p className="text-slate-400 text-sm mb-4">
          Create your {title.toLowerCase()} for FY {state.settings.currentFiscalYear}
        </p>
        <motion.button
          onClick={() => setShowDataForm({ show: true, type, editingData: null })}
          className={`bg-${color}-600 hover:bg-${color}-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 mx-auto transition-colors font-medium`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <SafeIcon icon={FiPlus} />
          <span>Create {title}</span>
        </motion.button>
      </div>
    </div>
  );

  const ReportCard = ({ type, title, report, icon, color }) => (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-3 bg-${color}-600 rounded-lg`}>
            <SafeIcon icon={icon} className="text-white text-xl" />
          </div>
          <h2 className="text-xl font-semibold text-white">{title}</h2>
        </div>
        <SafeIcon icon={icon} className="text-slate-400 text-xl" />
      </div>

      {!report ? (
        <CreateReportCard
          type={type}
          title={title}
          description={`Create your ${title.toLowerCase()} for the current fiscal year`}
          icon={icon}
          color={color}
        />
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-slate-700 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-green-400 text-sm font-medium">✅ {title} created</span>
                {report.originalFileName && (
                  <p className="text-slate-400 text-xs mt-1">
                    {report.originalFileName}
                  </p>
                )}
                <p className="text-slate-500 text-xs mt-1">
                  FY {report.fiscalYear || state.settings.currentFiscalYear} • Created: {new Date(report.uploadDate || report.extractedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex space-x-2">
                <motion.button
                  onClick={() => handleEditReport(type, report)}
                  className="text-blue-400 hover:text-blue-300 p-2 rounded-lg hover:bg-slate-600 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <SafeIcon icon={FiEdit} />
                </motion.button>
                <button className="text-green-400 hover:text-green-300 p-2 rounded-lg hover:bg-slate-600 transition-colors">
                  <SafeIcon icon={FiEye} />
                </button>
                <motion.button
                  onClick={() => handleDeleteReport(type)}
                  className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-slate-600 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <SafeIcon icon={FiTrash2} />
                </motion.button>
              </div>
            </div>
            <div className="text-xs text-slate-400 space-y-1">
              {type === 'profitLoss' && (
                <>
                  <p>Revenue Items: {Object.keys(report.revenue || {}).length}</p>
                  <p>Expense Items: {Object.keys(report.expenses || {}).length}</p>
                  <p>Total Revenue: {formatCurrency(report.totalRevenue || 0)}</p>
                  <p>Total Expenses: {formatCurrency(report.totalExpenses || 0)}</p>
                  <p>Net Profit: {formatCurrency((report.totalRevenue || 0) - (report.totalExpenses || 0))}</p>
                  <p>Source: {report.source || 'manual'}</p>
                </>
              )}
              {type === 'balanceSheet' && (
                <>
                  <p>Asset Items: {Object.keys(report.assets || {}).length}</p>
                  <p>Liability Items: {Object.keys(report.liabilities || {}).length}</p>
                  <p>Equity Items: {Object.keys(report.equity || {}).length}</p>
                  <p>Total Assets: {formatCurrency(report.totalAssets || 0)}</p>
                  <p>Total Liabilities: {formatCurrency(report.totalLiabilities || 0)}</p>
                  <p>Total Equity: {formatCurrency(report.totalEquity || 0)}</p>
                  <p>Source: {report.source || 'manual'}</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 p-4 lg:p-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Financial Reports</h1>
          <p className="text-slate-400 text-sm mt-1">
            Fiscal Year: {getFiscalYearDateRange()}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 items-end">
          <FiscalYearSettings />
          <div className="flex gap-2">
            <motion.button
              onClick={exportData}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <SafeIcon icon={FiDownload} />
              <span>Export JSON</span>
            </motion.button>
            <motion.button
              onClick={clearAllData}
              className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <SafeIcon icon={FiAlertCircle} />
              <span>Clear Data</span>
            </motion.button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReportCard
          type="profitLoss"
          title="Profit & Loss Statement"
          report={state.financialReports.profitLoss}
          icon={FiFileText}
          color="blue"
        />
        <ReportCard
          type="balanceSheet"
          title="Balance Sheet"
          report={state.financialReports.balanceSheet}
          icon={FiFileText}
          color="green"
        />
      </div>

      {/* Current Data Overview */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-semibold text-white mb-6">
          Current Data Overview - FY {state.settings.currentFiscalYear}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-700 rounded-lg p-4">
            <h3 className="text-slate-300 text-sm font-medium mb-2">Total Revenue</h3>
            <p className="text-2xl font-bold text-green-400 mb-1">
              {formatCurrency(metrics.totalRevenue)}
            </p>
            <p className="text-slate-400 text-xs">
              {metrics.hasUploadedData ? 'Includes financial reports' : 'Manual entries + clients/projects only'}
            </p>
          </div>
          <div className="bg-slate-700 rounded-lg p-4">
            <h3 className="text-slate-300 text-sm font-medium mb-2">Total Costs</h3>
            <p className="text-2xl font-bold text-red-400 mb-1">
              {formatCurrency(metrics.totalCosts)}
            </p>
            <p className="text-slate-400 text-xs">
              {metrics.hasUploadedData ? 'Includes financial reports' : 'Manual cost entries only'}
            </p>
          </div>
          <div className="bg-slate-700 rounded-lg p-4">
            <h3 className="text-slate-300 text-sm font-medium mb-2">Net Profit</h3>
            <p className="text-2xl font-bold text-blue-400 mb-1">
              {formatCurrency(metrics.grossProfit)}
            </p>
            <p className="text-slate-400 text-xs">
              Profit Margin: {metrics.profitMargin.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>

      {/* Quick Guide */}
      <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-6 border border-blue-500/30">
        <h2 className="text-xl font-semibold text-white mb-4">📊 How to Use Financial Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-white font-medium mb-2">Profit & Loss Statement</h3>
            <ul className="text-slate-300 text-sm space-y-1">
              <li>• Monthly breakdown for cash flow tracking</li>
              <li>• Add revenue and expense items</li>
              <li>• System calculates totals automatically</li>
              <li>• Use for tax planning and performance analysis</li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-medium mb-2">Balance Sheet</h3>
            <ul className="text-slate-300 text-sm space-y-1">
              <li>• Annual snapshot of financial position</li>
              <li>• List assets, liabilities, and equity</li>
              <li>• Shows business net worth</li>
              <li>• Essential for loan applications</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Forms */}
      <AnimatePresence>
        {showDataForm.show && (
          <FinancialDataForm
            type={showDataForm.type}
            editingData={showDataForm.editingData}
            onClose={() => setShowDataForm({ show: false, type: null, editingData: null })}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Financials;