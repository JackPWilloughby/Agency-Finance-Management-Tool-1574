import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useFinance } from '../context/FinanceContext';

const { FiCalendar, FiChevronDown, FiSettings, FiSave, FiX, FiGlobe } = FiIcons;

const FiscalYearSettings = () => {
  const { state, dispatch, getAvailableFiscalYears } = useFinance();
  const [isOpen, setIsOpen] = useState(false);
  const [tempSettings, setTempSettings] = useState({
    currentFiscalYear: state.settings.currentFiscalYear,
    fiscalYearStart: state.settings.fiscalYearStart,
    viewMode: state.settings.viewMode
  });

  const availableYears = getAvailableFiscalYears();

  const handleSave = () => {
    // Update fiscal year start
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: { fiscalYearStart: tempSettings.fiscalYearStart }
    });

    // Change fiscal year if different
    if (tempSettings.currentFiscalYear !== state.settings.currentFiscalYear) {
      dispatch({
        type: 'CHANGE_FISCAL_YEAR',
        payload: parseInt(tempSettings.currentFiscalYear)
      });
    }

    // Change view mode if different
    if (tempSettings.viewMode !== state.settings.viewMode) {
      dispatch({
        type: 'SET_VIEW_MODE',
        payload: tempSettings.viewMode
      });
    }

    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempSettings({
      currentFiscalYear: state.settings.currentFiscalYear,
      fiscalYearStart: state.settings.fiscalYearStart,
      viewMode: state.settings.viewMode
    });
    setIsOpen(false);
  };

  const getFiscalYearLabel = (year) => {
    const startMonth = tempSettings.fiscalYearStart;
    const endYear = year + 1;
    return `${startMonth} ${year} - ${startMonth} ${endYear}`;
  };

  const getCurrentDisplayText = () => {
    if (state.settings.viewMode === 'allTime') {
      return 'All Time View';
    }
    const startMonth = state.settings.fiscalYearStart;
    const currentYear = state.settings.currentFiscalYear;
    return `FY ${currentYear}-${currentYear + 1}`;
  };

  const quickToggleAllTime = () => {
    const newViewMode = state.settings.viewMode === 'allTime' ? 'current' : 'allTime';
    dispatch({
      type: 'SET_VIEW_MODE',
      payload: newViewMode
    });
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Quick All Time Toggle Button */}
      <motion.button
        onClick={quickToggleAllTime}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-xs font-medium ${
          state.settings.viewMode === 'allTime'
            ? 'bg-purple-600 hover:bg-purple-700 text-white'
            : 'bg-slate-600 hover:bg-slate-500 text-slate-300 hover:text-white'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <SafeIcon icon={FiGlobe} className="text-sm" />
        <span>All Time</span>
      </motion.button>

      {/* Settings Button */}
      <div className="relative">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-slate-300 hover:text-white"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <SafeIcon 
            icon={state.settings.viewMode === 'allTime' ? FiGlobe : FiCalendar} 
            className="text-sm" 
          />
          <span className="text-xs font-medium">{getCurrentDisplayText()}</span>
          <SafeIcon icon={FiSettings} className="text-xs" />
        </motion.button>

        {/* Settings Modal */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={handleCancel}
              />

              {/* Settings Panel */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute top-12 right-0 bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-2xl z-50 w-80"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Financial View Settings</h3>
                  <button onClick={handleCancel} className="text-slate-400 hover:text-white p-1">
                    <SafeIcon icon={FiX} />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* View Mode Selection */}
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-2">
                      View Mode
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="viewMode"
                          value="current"
                          checked={tempSettings.viewMode === 'current'}
                          onChange={(e) => setTempSettings(prev => ({ ...prev, viewMode: e.target.value }))}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-white text-sm">Current Fiscal Year</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="viewMode"
                          value="allTime"
                          checked={tempSettings.viewMode === 'allTime'}
                          onChange={(e) => setTempSettings(prev => ({ ...prev, viewMode: e.target.value }))}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-white text-sm">All Time Combined</span>
                      </label>
                    </div>
                    <p className="text-slate-400 text-xs mt-1">
                      {tempSettings.viewMode === 'allTime' 
                        ? 'Shows combined data from all fiscal years'
                        : 'Shows data for selected fiscal year only'
                      }
                    </p>
                  </div>

                  {/* Current Fiscal Year - only show if not in all time mode */}
                  {tempSettings.viewMode === 'current' && (
                    <div>
                      <label className="block text-slate-300 text-sm font-medium mb-2">
                        Current Fiscal Year
                      </label>
                      <div className="relative">
                        <select
                          value={tempSettings.currentFiscalYear}
                          onChange={(e) => setTempSettings(prev => ({ 
                            ...prev, 
                            currentFiscalYear: parseInt(e.target.value) 
                          }))}
                          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                        >
                          {availableYears.map(year => (
                            <option key={year} value={year}>
                              {getFiscalYearLabel(year)}
                            </option>
                          ))}
                        </select>
                        <SafeIcon 
                          icon={FiChevronDown} 
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none text-sm" 
                        />
                      </div>
                    </div>
                  )}

                  {/* Fiscal Year Start */}
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-2">
                      Fiscal Year Starts
                    </label>
                    <div className="relative">
                      <select
                        value={tempSettings.fiscalYearStart}
                        onChange={(e) => setTempSettings(prev => ({ 
                          ...prev, 
                          fiscalYearStart: e.target.value 
                        }))}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
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
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none text-sm" 
                      />
                    </div>
                  </div>

                  {/* Data Source Info */}
                  <div className="p-3 bg-slate-700 rounded-lg">
                    <p className="text-slate-300 text-xs font-medium mb-1">Data Source:</p>
                    <p className="text-slate-400 text-xs">
                      {tempSettings.viewMode === 'allTime' 
                        ? 'All historical data combined'
                        : state.financialReports.profitLoss || state.financialReports.balanceSheet
                          ? '✓ Financial reports uploaded'
                          : 'Manual entries only'
                      }
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 pt-2">
                    <button
                      onClick={handleCancel}
                      className="flex-1 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors text-sm"
                    >
                      Cancel
                    </button>
                    <motion.button
                      onClick={handleSave}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors text-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <SafeIcon icon={FiSave} className="text-sm" />
                      <span>Save</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FiscalYearSettings;