import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useFinance } from '../context/FinanceContext';
import ClientForm from '../components/ClientForm';
import ProjectForm from '../components/ProjectForm';

const { FiPlus, FiUsers, FiBriefcase, FiEdit2, FiTrash2, FiDollarSign } = FiIcons;

const Clients = () => {
  const { state, dispatch } = useFinance();
  const [showClientForm, setShowClientForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [editingProject, setEditingProject] = useState(null);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: state.settings.currency
    }).format(amount);
  };

  const formatCurrencyCompact = (amount) => {
    if (amount >= 1000) {
      return `£${(amount / 1000).toFixed(1)}k`;
    }
    return formatCurrency(amount);
  };

  const handleDeleteClient = (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      dispatch({ type: 'DELETE_CLIENT', payload: id });
    }
  };

  const handleDeleteProject = (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      dispatch({ type: 'DELETE_PROJECT', payload: id });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4 lg:space-y-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Clients & Projects</h1>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <motion.button
            onClick={() => setShowClientForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors text-sm font-medium"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <SafeIcon icon={FiPlus} />
            <span>Add Client</span>
          </motion.button>
          <motion.button
            onClick={() => setShowProjectForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors text-sm font-medium"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <SafeIcon icon={FiPlus} />
            <span>Add Project</span>
          </motion.button>
        </div>
      </div>

      {/* Clients Section */}
      <div className="bg-slate-800 rounded-xl p-4 lg:p-6 border border-slate-700">
        <div className="flex items-center space-x-3 mb-4 lg:mb-6">
          <SafeIcon icon={FiUsers} className="text-blue-400 text-lg lg:text-xl" />
          <h2 className="text-lg lg:text-xl font-semibold text-white">Clients</h2>
          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
            {state.clients.length}
          </span>
        </div>

        {state.clients.length === 0 ? (
          <div className="text-center py-8">
            <SafeIcon icon={FiUsers} className="text-slate-500 text-4xl mx-auto mb-4" />
            <p className="text-slate-400 mb-4">No clients added yet</p>
            <motion.button
              onClick={() => setShowClientForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Add Your First Client
            </motion.button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-4">
            {state.clients.map((client) => (
              <motion.div
                key={client.id}
                layout
                className="bg-slate-700 rounded-lg p-4 border border-slate-600"
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">{client.name}</h3>
                    <p className="text-slate-400 text-sm truncate">{client.email}</p>
                    {client.company && (
                      <p className="text-slate-500 text-xs truncate">{client.company}</p>
                    )}
                  </div>
                  <div className="flex space-x-1 ml-2">
                    <button
                      onClick={() => {
                        setEditingClient(client);
                        setShowClientForm(true);
                      }}
                      className="text-slate-400 hover:text-blue-400 p-2 touch-target"
                    >
                      <SafeIcon icon={FiEdit2} className="text-sm" />
                    </button>
                    <button
                      onClick={() => handleDeleteClient(client.id)}
                      className="text-slate-400 hover:text-red-400 p-2 touch-target"
                    >
                      <SafeIcon icon={FiTrash2} className="text-sm" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-xs">Type:</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      client.type === 'retainer' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-green-600 text-white'
                    }`}>
                      {client.type}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-xs">Amount:</span>
                    <div className="text-right">
                      <span className="text-white font-semibold text-sm">
                        {formatCurrencyCompact(client.amount)}
                      </span>
                      {client.type === 'retainer' && (
                        <span className="text-slate-400 text-xs ml-1">/mo</span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Projects Section */}
      <div className="bg-slate-800 rounded-xl p-4 lg:p-6 border border-slate-700">
        <div className="flex items-center space-x-3 mb-4 lg:mb-6">
          <SafeIcon icon={FiBriefcase} className="text-green-400 text-lg lg:text-xl" />
          <h2 className="text-lg lg:text-xl font-semibold text-white">One-off Projects</h2>
          <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
            {state.projects.length}
          </span>
        </div>

        {state.projects.length === 0 ? (
          <div className="text-center py-8">
            <SafeIcon icon={FiBriefcase} className="text-slate-500 text-4xl mx-auto mb-4" />
            <p className="text-slate-400 mb-4">No projects added yet</p>
            <motion.button
              onClick={() => setShowProjectForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Add Your First Project
            </motion.button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-4">
            {state.projects.map((project) => (
              <motion.div
                key={project.id}
                layout
                className="bg-slate-700 rounded-lg p-4 border border-slate-600"
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">{project.name}</h3>
                    {project.description && (
                      <p className="text-slate-400 text-sm truncate">{project.description}</p>
                    )}
                    {project.client && (
                      <p className="text-slate-500 text-xs truncate">{project.client}</p>
                    )}
                  </div>
                  <div className="flex space-x-1 ml-2">
                    <button
                      onClick={() => {
                        setEditingProject(project);
                        setShowProjectForm(true);
                      }}
                      className="text-slate-400 hover:text-blue-400 p-2 touch-target"
                    >
                      <SafeIcon icon={FiEdit2} className="text-sm" />
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="text-slate-400 hover:text-red-400 p-2 touch-target"
                    >
                      <SafeIcon icon={FiTrash2} className="text-sm" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-xs">Status:</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      project.status === 'completed' 
                        ? 'bg-green-600 text-white' 
                        : project.status === 'in-progress'
                        ? 'bg-blue-600 text-white'
                        : project.status === 'cancelled'
                        ? 'bg-red-600 text-white'
                        : 'bg-yellow-600 text-white'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-xs">Amount:</span>
                    <span className="text-white font-semibold text-sm">
                      {formatCurrencyCompact(project.amount)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Forms */}
      <AnimatePresence>
        {showClientForm && (
          <ClientForm
            client={editingClient}
            onClose={() => {
              setShowClientForm(false);
              setEditingClient(null);
            }}
          />
        )}
        {showProjectForm && (
          <ProjectForm
            project={editingProject}
            onClose={() => {
              setShowProjectForm(false);
              setEditingProject(null);
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Clients;