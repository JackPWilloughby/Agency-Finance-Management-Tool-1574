import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useFinance } from '../context/FinanceContext';
import CostForm from '../components/CostForm';

const { FiPlus, FiUsers, FiTrendingUp, FiSettings, FiEdit2, FiTrash2 } = FiIcons;

const Costs = () => {
  const { state, dispatch } = useFinance();
  const [showCostForm, setShowCostForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('team');
  const [editingCost, setEditingCost] = useState(null);

  const categories = [
    { key: 'team', label: 'Team Costs', icon: FiUsers, color: 'blue' },
    { key: 'marketing', label: 'Marketing', icon: FiTrendingUp, color: 'green' },
    { key: 'operations', label: 'Operations', icon: FiSettings, color: 'purple' }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: state.settings.currency
    }).format(amount);
  };

  const getCategoryTotal = (category) => {
    return state.costs[category].reduce((sum, cost) => sum + (cost.amount || 0), 0);
  };

  const handleDeleteCost = (cost) => {
    if (window.confirm('Are you sure you want to delete this cost?')) {
      dispatch({
        type: 'DELETE_COST',
        payload: { id: cost.id, category: cost.category }
      });
    }
  };

  const handleAddCost = (category) => {
    setSelectedCategory(category);
    setEditingCost(null);
    setShowCostForm(true);
  };

  const handleEditCost = (cost) => {
    setSelectedCategory(cost.category);
    setEditingCost(cost);
    setShowCostForm(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Costs & Expenses</h1>
      </div>

      {/* Category Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((category) => {
          const total = getCategoryTotal(category.key);
          const count = state.costs[category.key].length;
          
          return (
            <motion.div
              key={category.key}
              className={`bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-${category.color}-500 transition-colors`}
              whileHover={{ y: -4 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 bg-${category.color}-600 rounded-lg`}>
                    <SafeIcon icon={category.icon} className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{category.label}</h3>
                    <p className="text-slate-400 text-sm">{count} items</p>
                  </div>
                </div>
                <motion.button
                  onClick={() => handleAddCost(category.key)}
                  className={`bg-${category.color}-600 hover:bg-${category.color}-700 text-white p-2 rounded-lg transition-colors`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <SafeIcon icon={FiPlus} />
                </motion.button>
              </div>
              
              <div className="text-2xl font-bold text-white mb-2">
                {formatCurrency(total)}
              </div>
              
              <div className="text-slate-400 text-sm">
                Average: {formatCurrency(count > 0 ? total / count : 0)}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Detailed Cost Lists */}
      {categories.map((category) => (
        <div key={category.key} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center space-x-3 mb-6">
            <SafeIcon icon={category.icon} className={`text-${category.color}-400 text-xl`} />
            <h2 className="text-xl font-semibold text-white">{category.label}</h2>
            <span className={`bg-${category.color}-600 text-white text-xs px-2 py-1 rounded-full`}>
              {state.costs[category.key].length}
            </span>
          </div>

          {state.costs[category.key].length === 0 ? (
            <div className="text-center py-8">
              <SafeIcon icon={category.icon} className="text-slate-500 text-4xl mx-auto mb-4" />
              <p className="text-slate-400 mb-4">No {category.label.toLowerCase()} added yet</p>
              <motion.button
                onClick={() => handleAddCost(category.key)}
                className={`bg-${category.color}-600 hover:bg-${category.color}-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 mx-auto transition-colors`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <SafeIcon icon={FiPlus} />
                <span>Add {category.label}</span>
              </motion.button>
            </div>
          ) : (
            <div className="space-y-3">
              {state.costs[category.key].map((cost) => (
                <motion.div
                  key={cost.id}
                  layout
                  className="bg-slate-700 rounded-lg p-4 border border-slate-600 flex items-center justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-semibold text-white">{cost.name}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        cost.frequency === 'monthly' 
                          ? 'bg-blue-600 text-white'
                          : cost.frequency === 'yearly'
                          ? 'bg-green-600 text-white'
                          : 'bg-orange-600 text-white'
                      }`}>
                        {cost.frequency}
                      </span>
                    </div>
                    {cost.description && (
                      <p className="text-slate-400 text-sm mt-1">{cost.description}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-white font-semibold">
                        {formatCurrency(cost.amount)}
                      </div>
                      <div className="text-slate-400 text-xs">
                        {cost.frequency}
                      </div>
                    </div>
                    
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleEditCost(cost)}
                        className="text-slate-400 hover:text-blue-400 p-1"
                      >
                        <SafeIcon icon={FiEdit2} className="text-sm" />
                      </button>
                      <button
                        onClick={() => handleDeleteCost(cost)}
                        className="text-slate-400 hover:text-red-400 p-1"
                      >
                        <SafeIcon icon={FiTrash2} className="text-sm" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Cost Form Modal */}
      <AnimatePresence>
        {showCostForm && (
          <CostForm
            cost={editingCost}
            category={selectedCategory}
            onClose={() => {
              setShowCostForm(false);
              setEditingCost(null);
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Costs;