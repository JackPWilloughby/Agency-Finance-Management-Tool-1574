import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useFinance } from '../context/FinanceContext';

const { FiCalendar, FiChevronDown } = FiIcons;

const FiscalYearSelector = () => {
  const { state, dispatch, getAvailableFiscalYears } = useFinance();
  const availableYears = getAvailableFiscalYears();

  const handleYearChange = (year) => {
    dispatch({ type: 'CHANGE_FISCAL_YEAR', payload: parseInt(year) });
  };

  const handleStartMonthChange = (month) => {
    dispatch({ 
      type: 'UPDATE_SETTINGS', 
      payload: { fiscalYearStart: month }
    });
  };

  const getFiscalYearLabel = (year) => {
    const startMonth = state.settings.fiscalYearStart;
    const endYear = year + 1;
    return `${startMonth} ${year} - ${startMonth} ${endYear}`;
  };

  return (
    <div className="bg-slate-800 rounded-xl p-4 lg:p-6 border border-slate-700">
      <div className="flex items-center space-x-3 mb-4">
        <SafeIcon icon={FiCalendar} className="text-blue-400 text-lg" />
        <h3 className="text-lg font-semibold text-white">Financial Year</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Fiscal Year Selection */}
        <div>
          <label className="block text-slate-300 text-sm font-medium mb-2">
            Current Fiscal Year
          </label>
          <div className="relative">
            <select
              value={state.settings.currentFiscalYear}
              onChange={(e) => handleYearChange(e.target.value)}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              {availableYears.map(year => (
                <option key={year} value={year}>
                  {getFiscalYearLabel(year)}
                </option>
              ))}
            </select>
            <SafeIcon 
              icon={FiChevronDown} 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>
        </div>

        {/* Fiscal Year Start Month */}
        <div>
          <label className="block text-slate-300 text-sm font-medium mb-2">
            Fiscal Year Starts
          </label>
          <div className="relative">
            <select
              value={state.settings.fiscalYearStart}
              onChange={(e) => handleStartMonthChange(e.target.value)}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              {[
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
              ].map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
            <SafeIcon 
              icon={FiChevronDown} 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* Data Source Indicator */}
      <div className="mt-4 p-3 bg-slate-700 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-slate-300 text-sm font-medium">Data Source:</span>
            <p className="text-slate-400 text-xs mt-1">
              {state.financialReports.profitLoss || state.financialReports.balanceSheet
                ? 'Using uploaded financial reports + manual entries'
                : 'Using manual entries only'
              }
            </p>
          </div>
          
          {(state.financialReports.profitLoss || state.financialReports.balanceSheet) && (
            <div className="text-green-400 text-sm">
              ✓ Reports Available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FiscalYearSelector;