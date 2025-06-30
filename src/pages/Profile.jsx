import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

const { FiUser, FiMail, FiBriefcase, FiSave, FiEye, FiEyeOff, FiShield, FiEdit3 } = FiIcons;

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  const [profileData, setProfileData] = useState({
    fullName: '',
    companyName: '',
    email: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.user_metadata?.full_name || '',
        companyName: user.user_metadata?.company_name || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
    // Clear messages when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
    if (success) setSuccess('');
  };

  const validateProfileForm = () => {
    if (!profileData.fullName.trim()) {
      setError('Full name is required');
      return false;
    }
    if (!profileData.email.trim()) {
      setError('Email is required');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profileData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const validatePasswordForm = () => {
    if (!passwordData.currentPassword) {
      setError('Current password is required');
      return false;
    }
    if (!passwordData.newPassword) {
      setError('New password is required');
      return false;
    }
    if (passwordData.newPassword.length < 8) {
      setError('New password must be at least 8 characters');
      return false;
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordData.newPassword)) {
      setError('Password must contain uppercase, lowercase, and number');
      return false;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return false;
    }
    if (passwordData.currentPassword === passwordData.newPassword) {
      setError('New password must be different from current password');
      return false;
    }
    return true;
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    if (!validateProfileForm()) return;

    setLoading(true);
    setError('');

    try {
      // Update email if changed
      if (profileData.email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: profileData.email
        });
        if (emailError) throw emailError;
      }

      // Update metadata
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          full_name: profileData.fullName,
          company_name: profileData.companyName
        }
      });

      if (metadataError) throw metadataError;

      setSuccess('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);

    } catch (error) {
      console.error('Profile update error:', error);
      setError(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    if (!validatePasswordForm()) return;

    setLoading(true);
    setError('');

    try {
      // First verify current password by attempting to sign in
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: passwordData.currentPassword
      });

      if (verifyError) {
        throw new Error('Current password is incorrect');
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (updateError) throw updateError;

      setSuccess('Password updated successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordForm(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);

    } catch (error) {
      console.error('Password update error:', error);
      setError(error.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 p-4 lg:p-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
        <div className="text-slate-400 text-sm">
          Account Management
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-900/50 border border-green-500 rounded-lg p-4 text-green-200"
        >
          {success}
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-900/50 border border-red-500 rounded-lg p-4 text-red-200"
        >
          {error}
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center space-x-3 mb-6">
              <SafeIcon icon={FiEdit3} className="text-blue-400 text-xl" />
              <h2 className="text-xl font-semibold text-white">Profile Information</h2>
            </div>

            <form onSubmit={updateProfile} className="space-y-6">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <SafeIcon icon={FiUser} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    name="fullName"
                    value={profileData.fullName}
                    onChange={handleProfileChange}
                    className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <SafeIcon icon={FiMail} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <p className="text-slate-400 text-xs mt-1">
                  Changing your email will require verification
                </p>
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Company Name
                </label>
                <div className="relative">
                  <SafeIcon icon={FiBriefcase} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    name="companyName"
                    value={profileData.companyName}
                    onChange={handleProfileChange}
                    className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    placeholder="Enter your company name"
                  />
                </div>
              </div>

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
                    <SafeIcon icon={FiSave} />
                    <span>Save Profile</span>
                  </>
                )}
              </motion.button>
            </form>
          </div>

          {/* Password Section */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mt-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiShield} className="text-orange-400 text-xl" />
                <h2 className="text-xl font-semibold text-white">Security</h2>
              </div>
              {!showPasswordForm && (
                <motion.button
                  onClick={() => setShowPasswordForm(true)}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Change Password
                </motion.button>
              )}
            </div>

            {!showPasswordForm ? (
              <div className="text-center py-8">
                <SafeIcon icon={FiShield} className="text-slate-500 text-4xl mx-auto mb-4" />
                <p className="text-slate-400">Click "Change Password" to update your password</p>
                <p className="text-slate-500 text-sm mt-2">
                  Last updated: {user?.updated_at ? formatDate(user.updated_at) : 'Never'}
                </p>
              </div>
            ) : (
              <form onSubmit={updatePassword} className="space-y-6">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Current Password *
                  </label>
                  <div className="relative">
                    <SafeIcon icon={FiShield} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full pl-10 pr-12 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
                      placeholder="Enter current password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <SafeIcon icon={showCurrentPassword ? FiEyeOff : FiEye} />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    New Password *
                  </label>
                  <div className="relative">
                    <SafeIcon icon={FiShield} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full pl-10 pr-12 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
                      placeholder="Enter new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <SafeIcon icon={showNewPassword ? FiEyeOff : FiEye} />
                    </button>
                  </div>
                  <p className="text-slate-400 text-xs mt-1">
                    Must be 8+ characters with uppercase, lowercase, and number
                  </p>
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Confirm New Password *
                  </label>
                  <div className="relative">
                    <SafeIcon icon={FiShield} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
                      placeholder="Confirm new password"
                      required
                    />
                  </div>
                </div>

                <div className="flex space-x-3">
                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <SafeIcon icon={FiSave} />
                        <span>Update Password</span>
                      </>
                    )}
                  </motion.button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setPasswordData({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                      });
                      setError('');
                    }}
                    className="px-6 py-3 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Account Summary */}
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Account Summary</h3>
            <div className="space-y-4">
              <div>
                <p className="text-slate-400 text-sm">Account Created</p>
                <p className="text-white font-medium">
                  {user?.created_at ? formatDate(user.created_at) : 'Unknown'}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Last Sign In</p>
                <p className="text-white font-medium">
                  {user?.last_sign_in_at ? formatDate(user.last_sign_in_at) : 'Never'}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Email Verified</p>
                <p className="text-white font-medium flex items-center space-x-2">
                  <span>{user?.email_confirmed_at ? 'Yes' : 'No'}</span>
                  {user?.email_confirmed_at && (
                    <span className="text-green-400">✓</span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">User ID</p>
                <p className="text-white font-mono text-xs break-all">
                  {user?.id || 'Unknown'}
                </p>
              </div>
            </div>
          </div>

          {/* Security Tips */}
          <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-6 border border-blue-500/30">
            <h3 className="text-lg font-semibold text-white mb-4">🔐 Security Tips</h3>
            <ul className="text-slate-300 text-sm space-y-2">
              <li>• Use a strong, unique password</li>
              <li>• Don't share your login credentials</li>
              <li>• Sign out when using shared devices</li>
              <li>• Keep your email address updated</li>
              <li>• Review your account regularly</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;