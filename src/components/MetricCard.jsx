import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiArrowUp, FiArrowDown, FiMinus } = FiIcons;

const MetricCard = ({ title, value, icon, trend, bgColor, subtitle, compact = false }) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <SafeIcon icon={FiArrowUp} className="text-green-400" />;
      case 'down':
        return <SafeIcon icon={FiArrowDown} className="text-red-400" />;
      default:
        return <SafeIcon icon={FiMinus} className="text-slate-400" />;
    }
  };

  if (compact) {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="bg-slate-800 rounded-xl p-4 border border-slate-700 shadow-lg"
      >
        <div className="flex items-center justify-between mb-2">
          <div className={`p-2 ${bgColor} rounded-lg`}>
            <SafeIcon icon={icon} className="text-white text-sm" />
          </div>
          {getTrendIcon()}
        </div>
        <p className="text-slate-400 text-xs font-medium mb-1">{title}</p>
        <p className="text-lg font-bold text-white">{value}</p>
        {subtitle && (
          <p className="text-slate-400 text-xs mt-1">{subtitle}</p>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
          <p className="text-2xl font-bold text-white mb-1">{value}</p>
          {subtitle && (
            <p className="text-slate-400 text-xs">{subtitle}</p>
          )}
        </div>
        <div className="flex flex-col items-end space-y-2">
          <div className={`p-3 ${bgColor} rounded-lg`}>
            <SafeIcon icon={icon} className="text-white text-xl" />
          </div>
          {getTrendIcon()}
        </div>
      </div>
    </motion.div>
  );
};

export default MetricCard;