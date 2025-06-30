import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../common/SafeIcon'
import { useAuth } from '../hooks/useAuth'

const { FiShield, FiMail, FiArrowLeft, FiCheck } = FiIcons

const ForgotPassword = () => {
  const { resetPassword, error, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [success, setSuccess] = useState(false)
  const [validationError, setValidationError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      setValidationError('Email is required')
      return
    } else if (!emailRegex.test(email)) {
      setValidationError('Please enter a valid email address')
      return
    }

    setValidationError('')
    const { error } = await resetPassword(email)
    
    if (!error) {
      setSuccess(true)
    }
  }

  const handleChange = (e) => {
    setEmail(e.target.value)
    if (validationError) {
      setValidationError('')
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700 w-full max-w-md text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
            <SafeIcon icon={FiCheck} className="text-white text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Check Your Email</h2>
          <p className="text-slate-400 mb-6">
            We've sent a password reset link to <strong>{email}</strong>
          </p>
          <p className="text-slate-500 text-sm mb-6">
            Click the link in the email to reset your password. The link will expire in 24 hours.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 font-medium"
          >
            <SafeIcon icon={FiArrowLeft} />
            <span>Back to Sign In</span>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <SafeIcon icon={FiShield} className="text-white text-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Forgot Password?</h1>
          <p className="text-slate-400">Enter your email to receive a reset link</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Email Address
            </label>
            <div className="relative">
              <SafeIcon 
                icon={FiMail} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" 
              />
              <input
                type="email"
                value={email}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 bg-slate-700 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  validationError ? 'border-red-500' : 'border-slate-600'
                }`}
                placeholder="Enter your email"
                required
              />
            </div>
            {validationError && (
              <p className="text-red-400 text-sm mt-1">{validationError}</p>
            )}
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200 text-sm"
            >
              {error}
            </motion.div>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <SafeIcon icon={FiMail} />
                <span>Send Reset Link</span>
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center space-x-1 justify-center"
          >
            <SafeIcon icon={FiArrowLeft} className="text-xs" />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default ForgotPassword