import React, { useState, useEffect, useMemo } from 'react';
import { useLocalStorageJSON } from "./useLocalStorageJSON";
import { 
  LayoutDashboard, FileText, DollarSign, Users, Calendar, 
  AlertCircle, Plus, Search, Edit2, Trash2, X, Download, Clock, 
  CheckCircle, TrendingUp, Shield, List, Award 
} from 'lucide-react';

const CourtStreetRCM = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [claims, setClaims] = useState([]);
  const [payments, setPayments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [preauths, setPreauths] = useState([]);
  const [dailyTasks, setDailyTasks] = useState([]);
  const [weeklyTasks, setWeeklyTasks] = useState([]);
  const [monthlyTasks, setMonthlyTasks] = useState([]);
  const [scorecardMetrics, setScorecardMetrics] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  
  const csdGold = '#B8985F';

  // Historical monthly data for trend analysis
  const monthlyDataDefault: Record<string, number> = {

    'June 2024': 102423.20,
    'July 2024': 148694.51,
    'August 2024': 187505.22,
    'September 2024': 165725.27,
    'October 2024': 168236.38,
    'November 2024': 113077.01,
    'December 2024': 118898.18
  
};
const [monthlyData, setMonthlyData] = useLocalStorageJSON<Record<string, number>>("monthlyData", monthlyDataDefault);

  // Insurance portals with EFT status and provider-specific network participation
  const providers = ['Dr. Gajjar', 'Dr. Judge', 'Dr. Strachan'];
  
  const insurancePortals = [
    { 
      name: 'Aetna', 
      status: 'All Set!', 
      eftStatus: 'Enrolled', 
      feeSchedule: 'Direct',
      providers: {
        'Dr. Gajjar': 'In-Network',
        'Dr. Judge': 'In-Network',
        'Dr. Strachan': 'In-Network'
      }
    },
    { 
      name: 'Cigna', 
      status: 'All Set!', 
      eftStatus: 'Enrolled', 
      feeSchedule: 'Connection',
      providers: {
        'Dr. Gajjar': 'In-Network',
        'Dr. Judge': 'In-Network',
        'Dr. Strachan': 'In-Network'
      }
    },
    { 
      name: 'Delta Dental Insurance', 
      status: 'All Set!', 
      eftStatus: 'Enrolled', 
      feeSchedule: 'Direct',
      providers: {
        'Dr. Gajjar': 'Out-of-Network',
        'Dr. Judge': 'Out-of-Network',
        'Dr. Strachan': 'Out-of-Network'
      }
    },
    { 
      name: 'MetLife', 
      status: 'All Set!', 
      eftStatus: 'Enrolled', 
      feeSchedule: 'Connection',
      providers: {
        'Dr. Gajjar': 'In-Network',
        'Dr. Judge': 'In-Network',
        'Dr. Strachan': 'In-Network'
      }
    },
    { 
      name: 'Anthem BCBS', 
      status: 'All Set!', 
      eftStatus: 'Enrolled', 
      feeSchedule: 'Decare',
      providers: {
        'Dr. Gajjar': 'In-Network',
        'Dr. Judge': 'In-Network',
        'Dr. Strachan': 'In-Network'
      }
    },
    { 
      name: 'United Healthcare (Optum ID)', 
      status: 'All Set!', 
      eftStatus: 'Enrolled', 
      feeSchedule: 'Connection',
      providers: {
        'Dr. Gajjar': 'Out-of-Network',
        'Dr. Judge': 'Out-of-Network',
        'Dr. Strachan': 'Out-of-Network'
      }
    },
    { 
      name: 'Guardian', 
      status: 'All Set!', 
      eftStatus: 'Enrolled', 
      feeSchedule: 'Connection',
      providers: {
        'Dr. Gajjar': 'Out-of-Network',
        'Dr. Judge': 'Out-of-Network',
        'Dr. Strachan': 'Out-of-Network'
      }
    },
    { 
      name: 'Humana', 
      status: 'All Set!', 
      eftStatus: 'Enrolled', 
      feeSchedule: 'Direct',
      providers: {
        'Dr. Gajjar': 'In-Network',
        'Dr. Judge': 'In-Network',
        'Dr. Strachan': 'In-Network'
      }
    },
    { 
      name: 'Ameritas', 
      status: 'All Set!', 
      eftStatus: 'Enrolled', 
      feeSchedule: 'Direct',
      providers: {
        'Dr. Gajjar': 'In-Network',
        'Dr. Judge': 'In-Network',
        'Dr. Strachan': 'In-Network'
      }
    },
    { 
      name: 'Principal', 
      status: 'All Set!', 
      eftStatus: 'Enrolled', 
      feeSchedule: 'Direct',
      providers: {
        'Dr. Gajjar': 'In-Network',
        'Dr. Judge': 'In-Network',
        'Dr. Strachan': 'In-Network'
      }
    },
    { 
      name: 'Beam Benefits', 
      status: 'All Set!', 
      eftStatus: 'Enrolled', 
      feeSchedule: 'Direct',
      providers: {
        'Dr. Gajjar': 'Out-of-Network',
        'Dr. Judge': 'Out-of-Network',
        'Dr. Strachan': 'Out-of-Network'
      }
    }
  ];

  // Default daily checklist
  const defaultDailyChecklist = [
    { time: 'Morning', task: 'Conduct Morning Check-ins', completed: false },
    { time: 'Morning', task: 'Review previous day performance metrics', completed: false },
    { time: 'Morning', task: 'Review prior day deposit reports', completed: false },
    { time: '12 PM', task: 'Ensure all claims submitted timely', completed: false },
    { time: '12 PM', task: 'Enter EFT Payments', completed: false },
    { time: '1 PM', task: 'Check for insurance check scans & deposit reports', completed: false },
    { time: '4 PM', task: 'Ensure all insurance payments entered', completed: false },
    { time: 'EOD', task: 'Send End of Day Report', completed: false },
    { time: 'EOD', task: 'Review Appeals on Trello', completed: false },
    { time: 'EOD', task: 'Conduct 1 full chart audit', completed: false }
  ];

  const defaultWeeklyTasks = [
    { task: 'Pull Outstanding Insurance Claims Report', completed: false },
    { task: 'Review Insurance Aging Report', completed: false },
    { task: 'Call/Text/Email Patients with outstanding balances', completed: false },
    { task: 'Correspond with Office Managers on workflow improvements', completed: false },
    { task: 'Review and optimize scheduling for next week', completed: false }
  ];

  const defaultMonthlyTasks = [
    { task: 'Verify RCM Spreadsheet Completion', completed: false },
    { task: 'Aging of Accounts Receivable Report', completed: false },
    { task: 'Pull A/R >12 months for write-offs', completed: false },
    { task: 'Update KPI Charts', completed: false },
    { task: 'Send reports to accountant', completed: false },
    { task: 'Review TX Plan Acceptance trends', completed: false },
    { task: 'Track Monthly Denials %', completed: false },
    { task: 'Prepare RCM updates for meetings', completed: false }
  ];

  // Sample Practice Scorecard Metrics
  const sampleScorecardData = [
    {
      weekNumber: 1,
      weekOf: '2025-01-06',
      showRateDr: 0.80,
      showRateHyg: 0.529,
      utilizationDr: null,
      utilizationHyg: null,
      ar30: null,
      ar60: null,
      ar90: null,
      newPatients: 6,
      treatmentPresented: 18470,
      treatmentAcceptanceRate: 0.2162,
      treatmentAccepted: 18470,
      churnedPts: null,
      churnRate: null,
      collectionRate: 0.3288,
      referralRate: null,
      fiveStarReviews: 0,
      extraCareRedos: 0,
      notes: 'Week starting Monday, January 6, 2025'
    },
    {
      weekNumber: 2,
      weekOf: '2025-01-13',
      showRateDr: 0.75,
      showRateHyg: 0.457,
      utilizationDr: null,
      utilizationHyg: null,
      ar30: null,
      ar60: null,
      ar90: null,
      newPatients: 7,
      treatmentPresented: 38955,
      treatmentAcceptanceRate: 0.8364,
      treatmentAccepted: 32722.2,
      churnedPts: null,
      churnRate: null,
      collectionRate: 0.8848,
      referralRate: null,
      fiveStarReviews: 0,
      extraCareRedos: 0,
      notes: 'Week starting Monday, January 13, 2025'
    }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      const claimsData = localStorage.getItem('claims');
      const paymentsData = localStorage.getItem('payments');
      const patientsData = localStorage.getItem('patients');
      const preauthsData = localStorage.getItem('preauths');
      const dailyTasksData = localStorage.getItem('dailyTasks');
      const weeklyTasksData = localStorage.getItem('weeklyTasks');
      const monthlyTasksData = localStorage.getItem('monthlyTasks');
      const scorecardData = localStorage.getItem('scorecardMetrics');
      
      if (claimsData) setClaims(JSON.parse(claimsData));
      if (paymentsData) setPayments(JSON.parse(paymentsData));
      if (patientsData) setPatients(JSON.parse(patientsData));
      if (preauthsData) setPreauths(JSON.parse(preauthsData));
      if (dailyTasksData) setDailyTasks(JSON.parse(dailyTasksData));
      else setDailyTasks(defaultDailyChecklist);
      if (weeklyTasksData) setWeeklyTasks(JSON.parse(weeklyTasksData));
      else setWeeklyTasks(defaultWeeklyTasks);
      if (monthlyTasksData) setMonthlyTasks(JSON.parse(monthlyTasksData));
      else setMonthlyTasks(defaultMonthlyTasks);
      if (scorecardData) setScorecardMetrics(JSON.parse(scorecardData));
      else setScorecardMetrics(sampleScorecardData);
    } catch (error) {
      console.log('Loading data from localStorage');
      setDailyTasks(defaultDailyChecklist);
      setWeeklyTasks(defaultWeeklyTasks);
      setMonthlyTasks(defaultMonthlyTasks);
      setScorecardMetrics(sampleScorecardData);
    }
  };

  const saveData = (type, data) => {
    try {
      localStorage.setItem(type, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage');
    }
  };

  const resetForm = () => {
    setFormData({});
    setEditingItem(null);
  };

  const calculateKPIs = () => {
    const totalPayments = payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
    const outstandingClaims = claims.filter(c => c.status !== 'Paid' && c.status !== 'Closed').length;
    
    const claims0to30 = claims.filter(c => {
      const days = Math.floor((new Date() - new Date(c.dateOfService)) / (1000 * 60 * 60 * 24));
      return days <= 30 && c.status !== 'Paid' && c.status !== 'Closed';
    }).length;
    
    const claims31to60 = claims.filter(c => {
      const days = Math.floor((new Date() - new Date(c.dateOfService)) / (1000 * 60 * 60 * 24));
      return days > 30 && days <= 60 && c.status !== 'Paid' && c.status !== 'Closed';
    }).length;
    
    const claims61to90 = claims.filter(c => {
      const days = Math.floor((new Date() - new Date(c.dateOfService)) / (1000 * 60 * 60 * 24));
      return days > 60 && days <= 90 && c.status !== 'Paid' && c.status !== 'Closed';
    }).length;
    
    const claimsOver90 = claims.filter(c => {
      const days = Math.floor((new Date() - new Date(c.dateOfService)) / (1000 * 60 * 60 * 24));
      return days > 90 && c.status !== 'Paid' && c.status !== 'Closed';
    }).length;
    
    const avgDaysInAR = claims.length > 0 ? Math.floor(claims.reduce((sum, c) => {
      const days = Math.floor((new Date() - new Date(c.dateOfService)) / (1000 * 60 * 60 * 24));
      return sum + days;
    }, 0) / claims.length) : 0;
    
    return { 
      totalPayments, 
      outstandingClaims, 
      claimsOver90, 
      avgDaysInAR,
      claims0to30,
      claims31to60,
      claims61to90
    };
  };

  const kpis = calculateKPIs();

  // Calculate YTD and trends from historical data
  const ytdCollections = useMemo(() => {
    return Object.values(monthlyData).reduce((sum, val) => sum + val, 0);
  }, []);

  const avgMonthlyCollections = useMemo(() => {
    const values = Object.values(monthlyData);
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }, []);

  const collectionsTrend = useMemo(() => {
    const values = Object.values(monthlyData);
    const first = values[0];
    const last = values[values.length - 1];
    return ((last - first) / first * 100).toFixed(1);
  }, []);

  // Priority tasks for today
  const priorityTasks = useMemo(() => {
    const urgent = claims.filter(c => {
      const days = Math.floor((new Date() - new Date(c.dateOfService)) / (1000 * 60 * 60 * 24));
      return days > 60 && (c.status === 'Pending' || c.status === 'Resubmitted');
    }).slice(0, 5);
    
    const incomplete = dailyTasks.filter(t => !t.completed).slice(0, 5);
    
    return { urgentClaims: urgent, incompleteTasks: incomplete };
  }, [claims, dailyTasks]);

  // Claims functions
  const addClaim = (claim) => {
    const newClaim = { id: 'CLM-' + Date.now(), ...claim, createdAt: new Date().toISOString() };
    const updated = [...claims, newClaim];
    setClaims(updated);
    saveData('claims', updated);
  };

  const updateClaim = (id, updatedData) => {
    const updated = claims.map(c => c.id === id ? { ...c, ...updatedData } : c);
    setClaims(updated);
    saveData('claims', updated);
  };

  const deleteClaim = (id) => {
    const updated = claims.filter(c => c.id !== id);
    setClaims(updated);
    saveData('claims', updated);
  };

  // Payment functions
  const addPayment = (payment) => {
    const newPayment = { id: 'PAY-' + Date.now(), ...payment, createdAt: new Date().toISOString() };
    const updated = [...payments, newPayment];
    setPayments(updated);
    saveData('payments', updated);
  };

  const updatePayment = (id, updatedData) => {
    const updated = payments.map(p => p.id === id ? { ...p, ...updatedData } : p);
    setPayments(updated);
    saveData('payments', updated);
  };

  const deletePayment = (id) => {
    const updated = payments.filter(p => p.id !== id);
    setPayments(updated);
    saveData('payments', updated);
  };

  // Patient functions
  const addPatient = (patient) => {
    const newPatient = { id: 'PT-' + Date.now(), ...patient, createdAt: new Date().toISOString() };
    const updated = [...patients, newPatient];
    setPatients(updated);
    saveData('patients', updated);
  };

  const updatePatient = (id, updatedData) => {
    const updated = patients.map(p => p.id === id ? { ...p, ...updatedData } : p);
    setPatients(updated);
    saveData('patients', updated);
  };

  const deletePatient = (id) => {
    const updated = patients.filter(p => p.id !== id);
    setPatients(updated);
    saveData('patients', updated);
  };

  // Pre-auth functions
  const addPreauth = (preauth) => {
    const newPreauth = { id: 'PA-' + Date.now(), ...preauth, createdAt: new Date().toISOString() };
    const updated = [...preauths, newPreauth];
    setPreauths(updated);
    saveData('preauths', updated);
  };

  const updatePreauth = (id, updatedData) => {
    const updated = preauths.map(p => p.id === id ? { ...p, ...updatedData } : p);
    setPreauths(updated);
    saveData('preauths', updated);
  };

  const deletePreauth = (id) => {
    const updated = preauths.filter(p => p.id !== id);
    setPreauths(updated);
    saveData('preauths', updated);
  };

  // Task functions
  const toggleDailyTask = (index) => {
    const updated = [...dailyTasks];
    updated[index].completed = !updated[index].completed;
    setDailyTasks(updated);
    saveData('dailyTasks', updated);
  };

  const toggleWeeklyTask = (index) => {
    const updated = [...weeklyTasks];
    updated[index].completed = !updated[index].completed;
    setWeeklyTasks(updated);
    saveData('weeklyTasks', updated);
  };

  const toggleMonthlyTask = (index) => {
    const updated = [...monthlyTasks];
    updated[index].completed = !updated[index].completed;
    setMonthlyTasks(updated);
    saveData('monthlyTasks', updated);
  };

  const resetDailyTasks = () => {
    const reset = dailyTasks.map(t => ({ ...t, completed: false }));
    setDailyTasks(reset);
    saveData('dailyTasks', reset);
  };

  // Scorecard functions
  const addScorecardMetric = (metric) => {
    const newMetric = { id: 'SCM-' + Date.now(), ...metric, createdAt: new Date().toISOString() };
    const updated = [...scorecardMetrics, newMetric];
    setScorecardMetrics(updated);
    saveData('scorecardMetrics', updated);
  };

  const updateScorecardMetric = (id, updatedData) => {
    const updated = scorecardMetrics.map(m => m.id === id ? { ...m, ...updatedData } : m);
    setScorecardMetrics(updated);
    saveData('scorecardMetrics', updated);
  };

  const deleteScorecardMetric = (id) => {
    const updated = scorecardMetrics.filter(m => m.id !== id);
    setScorecardMetrics(updated);
    saveData('scorecardMetrics', updated);
  };

  // Calculate scorecard averages
  const calculateScorecardAverages = useMemo(() => {
    if (scorecardMetrics.length === 0) return null;
    
    const validMetrics = scorecardMetrics.filter(m => m);
    
    return {
      avgShowRateDr: (validMetrics.reduce((sum, m) => sum + (parseFloat(m.showRateDr) || 0), 0) / validMetrics.length).toFixed(3),
      avgShowRateHyg: (validMetrics.reduce((sum, m) => sum + (parseFloat(m.showRateHyg) || 0), 0) / validMetrics.length).toFixed(3),
      avgNewPatients: Math.round(validMetrics.reduce((sum, m) => sum + (parseInt(m.newPatients) || 0), 0) / validMetrics.length),
      avgTreatmentAcceptance: (validMetrics.reduce((sum, m) => sum + (parseFloat(m.treatmentAcceptanceRate) || 0), 0) / validMetrics.length).toFixed(3),
      avgCollectionRate: (validMetrics.reduce((sum, m) => sum + (parseFloat(m.collectionRate) || 0), 0) / validMetrics.length).toFixed(3),
      totalTreatmentPresented: validMetrics.reduce((sum, m) => sum + (parseFloat(m.treatmentPresented) || 0), 0),
      totalTreatmentAccepted: validMetrics.reduce((sum, m) => sum + (parseFloat(m.treatmentAccepted) || 0), 0),
      totalNewPatients: validMetrics.reduce((sum, m) => sum + (parseInt(m.newPatients) || 0), 0),
      totalFiveStarReviews: validMetrics.reduce((sum, m) => sum + (parseInt(m.fiveStarReviews) || 0), 0),
      totalRedos: validMetrics.reduce((sum, m) => sum + (parseInt(m.extraCareRedos) || 0), 0)
    };
  }, [scorecardMetrics]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (currentView === 'claims') {
      if (editingItem) {
        updateClaim(editingItem.id, formData);
      } else {
        addClaim(formData);
      }
    } else if (currentView === 'payments') {
      if (editingItem) {
        updatePayment(editingItem.id, formData);
      } else {
        addPayment(formData);
      }
    } else if (currentView === 'patients') {
      if (editingItem) {
        updatePatient(editingItem.id, formData);
      } else {
        addPatient(formData);
      }
    } else if (currentView === 'preauths') {
      if (editingItem) {
        updatePreauth(editingItem.id, formData);
      } else {
        addPreauth(formData);
      }
    } else if (currentView === 'scorecard') {
      if (editingItem) {
        updateScorecardMetric(editingItem.id, formData);
      } else {
        addScorecardMetric(formData);
      }
    }
    
    setShowAddModal(false);
    resetForm();
  };

  // Dashboard View Component
  const DashboardView = () => (
    <div className="space-y-6">
      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-100 text-sm">Monthly Collections</span>
            <DollarSign className="w-5 h-5 text-blue-200" />
          </div>
          <div className="text-3xl font-bold">${kpis.totalPayments.toLocaleString()}</div>
          <div className="text-blue-100 text-xs mt-2">November 2025</div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-100 text-sm">Outstanding Claims</span>
            <FileText className="w-5 h-5 text-green-200" />
          </div>
          <div className="text-3xl font-bold">{kpis.outstandingClaims}</div>
          <div className="text-green-100 text-xs mt-2">Active claims</div>
        </div>
        
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-amber-100 text-sm">Avg Days in AR</span>
            <Clock className="w-5 h-5 text-amber-200" />
          </div>
          <div className="text-3xl font-bold">{kpis.avgDaysInAR}</div>
          <div className="text-amber-100 text-xs mt-2">Target: less than 45</div>
        </div>
        
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-red-100 text-sm">Claims 90+ Days</span>
            <AlertCircle className="w-5 h-5 text-red-200" />
          </div>
          <div className="text-3xl font-bold">{kpis.claimsOver90}</div>
          <div className="text-red-100 text-xs mt-2">Needs attention</div>
        </div>
      </div>

      {/* AR Aging Buckets */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Claims Aging Analysis</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{kpis.claims0to30}</div>
            <div className="text-sm text-gray-600 mt-1">0-30 Days</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{kpis.claims31to60}</div>
            <div className="text-sm text-gray-600 mt-1">31-60 Days</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{kpis.claims61to90}</div>
            <div className="text-sm text-gray-600 mt-1">61-90 Days</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{kpis.claimsOver90}</div>
            <div className="text-sm text-gray-600 mt-1">90+ Days</div>
          </div>
        </div>
      </div>

      {/* Monthly Collections Trend and Priority Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Monthly Collections Trend</h3>
            <div className="flex items-center text-sm">
              <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
              <span className="text-green-600 font-medium">{collectionsTrend}%</span>
            </div>
          </div>
          <div className="space-y-3">
            {Object.entries(monthlyData).map(([month, amount]) => {
              const percentage = (amount / ytdCollections) * 100;
              return (
                <div key={month} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 font-medium">{month}</span>
                    <span className="text-gray-900 font-semibold">${amount.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-gray-600">YTD Total</span>
              <span className="text-gray-900">${ytdCollections.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-600">Monthly Average</span>
              <span className="text-gray-900">${avgMonthlyCollections.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Today's Priority Tasks */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Today&apos;s Priority Tasks</h3>
          
          {priorityTasks.urgentClaims.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-red-600 mb-2">Urgent Claims (60+ days)</h4>
              <div className="space-y-2">
                {priorityTasks.urgentClaims.map((claim, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-red-50 rounded border border-red-200">
                    <div className="text-sm">
                      <span className="font-medium">{claim.patientName}</span>
                      <span className="text-gray-600 ml-2">- {claim.insurance}</span>
                    </div>
                    <span className="text-xs px-2 py-1 bg-red-200 text-red-800 rounded-full">
                      {Math.floor((new Date() - new Date(claim.dateOfService)) / (1000 * 60 * 60 * 24))} days
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <h4 className="text-sm font-medium text-gray-700 mb-2">Incomplete Daily Tasks</h4>
          <div className="space-y-2">
            {priorityTasks.incompleteTasks.map((task, idx) => (
              <div key={idx} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                <input 
                  type="checkbox" 
                  checked={task.completed}
                  onChange={() => toggleDailyTask(dailyTasks.findIndex(t => t.task === task.task))}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <div className="flex-1 text-sm text-gray-700">{task.task}</div>
                <span className="text-xs text-gray-500">{task.time}</span>
              </div>
            ))}
          </div>
          {priorityTasks.incompleteTasks.length === 0 && (
            <div className="text-center py-4">
              <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-2" />
              <p className="text-sm text-gray-600">All daily tasks completed!</p>
            </div>
          )}
        </div>
      </div>

      {/* Provider Network Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Provider Network Status</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase sticky left-0 bg-gray-50">Insurance</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fee Schedule</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Dr. Gajjar</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Dr. Judge</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Dr. Strachan</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">EFT Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {insurancePortals.map((portal, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800 sticky left-0 bg-white">
                    {portal.name}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      portal.feeSchedule === 'Direct' ? 'bg-blue-100 text-blue-800' :
                      portal.feeSchedule === 'Connection' ? 'bg-purple-100 text-purple-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {portal.feeSchedule}
                    </span>
                  </td>
                  {providers.map(provider => (
                    <td key={provider} className="px-4 py-3 text-center">
                      {portal.providers[provider] === 'In-Network' ? (
                        <div className="flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <X className="w-5 h-5 text-red-500" />
                        </div>
                      )}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      {portal.eftStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Legend */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700">Fee Schedules:</span>
              <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">Direct</span>
              <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">Connection</span>
              <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Decare</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700">Network Status:</span>
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-xs text-gray-600">In-Network</span>
              <X className="w-4 h-4 text-red-500 ml-2" />
              <span className="text-xs text-gray-600">Out-of-Network</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Payments</h3>
          <div className="space-y-3">
            {payments.slice(-5).reverse().map((payment, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-800">{payment.payer || 'Payment'}</div>
                  <div className="text-xs text-gray-500">{new Date(payment.date).toLocaleDateString()}</div>
                </div>
                <div className="text-lg font-semibold text-gray-800">${parseFloat(payment.amount).toLocaleString()}</div>
              </div>
            ))}
            {payments.length === 0 && <div className="text-center text-gray-500 py-4">No payments yet</div>}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Claims Requiring Attention</h3>
          <div className="space-y-3">
            {claims.filter(c => c.status === 'Pending' || c.status === 'Resubmitted').slice(0, 5).map((claim, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                <div>
                  <div className="font-medium text-gray-800">{claim.patientName}</div>
                  <div className="text-xs text-gray-500">{claim.insurance} - {claim.status}</div>
                </div>
                <span className="text-xs px-2 py-1 bg-amber-200 text-amber-800 rounded-full font-medium">{claim.status}</span>
              </div>
            ))}
            {claims.filter(c => c.status === 'Pending' || c.status === 'Resubmitted').length === 0 && 
              <div className="text-center text-gray-500 py-4">No claims requiring attention</div>
            }
          </div>
        </div>
      </div>
    </div>
  );

  // Claims View
  const ClaimsView = () => {
    const filteredClaims = claims.filter(c => 
      searchTerm === '' || 
      c.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.patientId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.insurance?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getClaimPriority = (claim) => {
      const days = Math.floor((new Date() - new Date(claim.dateOfService)) / (1000 * 60 * 60 * 24));
      const amount = parseFloat(claim.amount) || 0;
      
      if (days > 60 && amount > 1000) return { score: 5, label: 'Critical' };
      if (days > 60 || amount > 1000) return { score: 4, label: 'High' };
      if (days > 30 && amount > 500) return { score: 3, label: 'Medium' };
      if (days > 30 || amount > 500) return { score: 2, label: 'Low' };
      return { score: 1, label: 'Normal' };
    };

    const claimsByAging = {
      '0-30': claims.filter(c => {
        const days = Math.floor((new Date() - new Date(c.dateOfService)) / (1000 * 60 * 60 * 24));
        return days <= 30 && c.status !== 'Paid' && c.status !== 'Closed';
      }),
      '31-60': claims.filter(c => {
        const days = Math.floor((new Date() - new Date(c.dateOfService)) / (1000 * 60 * 60 * 24));
        return days > 30 && days <= 60 && c.status !== 'Paid' && c.status !== 'Closed';
      }),
      '61-90': claims.filter(c => {
        const days = Math.floor((new Date() - new Date(c.dateOfService)) / (1000 * 60 * 60 * 24));
        return days > 60 && days <= 90 && c.status !== 'Paid' && c.status !== 'Closed';
      }),
      '90+': claims.filter(c => {
        const days = Math.floor((new Date() - new Date(c.dateOfService)) / (1000 * 60 * 60 * 24));
        return days > 90 && c.status !== 'Paid' && c.status !== 'Closed';
      })
    };

    const outstandingByBucket = {
      '0-30': claimsByAging['0-30'].reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0),
      '31-60': claimsByAging['31-60'].reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0),
      '61-90': claimsByAging['61-90'].reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0),
      '90+': claimsByAging['90+'].reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0)
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Claims Management</h2>
          <button 
            onClick={() => { setShowAddModal(true); resetForm(); }} 
            className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white font-medium" 
            style={{ backgroundColor: csdGold }}
          >
            <Plus className="w-5 h-5" />
            <span>New Claim</span>
          </button>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Total Active Claims</div>
              <FileText className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-800">{claims.filter(c => c.status !== 'Paid' && c.status !== 'Closed').length}</div>
            <div className="text-xs text-gray-500 mt-1">Outstanding</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Pending Claims</div>
              <Clock className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-800">{claims.filter(c => c.status === 'Pending').length}</div>
            <div className="text-xs text-gray-500 mt-1">Awaiting response</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Denied Claims</div>
              <AlertCircle className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-800">{claims.filter(c => c.status === 'Denied').length}</div>
            <div className="text-xs text-gray-500 mt-1">Need attention</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Claims &gt;60 Days</div>
              <AlertCircle className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {claimsByAging['61-90'].length + claimsByAging['90+'].length}
            </div>
            <div className="text-xs text-gray-500 mt-1">Priority follow-up</div>
          </div>
        </div>

        {/* AR Aging Analysis */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">AR Aging Analysis</h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg border-2 border-green-200">
              <div className="text-2xl font-bold text-green-600">{claimsByAging['0-30'].length}</div>
              <div className="text-sm text-gray-600 mt-1">0-30 Days</div>
              <div className="text-lg font-semibold text-green-700 mt-2">${outstandingByBucket['0-30'].toLocaleString()}</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
              <div className="text-2xl font-bold text-yellow-600">{claimsByAging['31-60'].length}</div>
              <div className="text-sm text-gray-600 mt-1">31-60 Days</div>
              <div className="text-lg font-semibold text-yellow-700 mt-2">${outstandingByBucket['31-60'].toLocaleString()}</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
              <div className="text-2xl font-bold text-orange-600">{claimsByAging['61-90'].length}</div>
              <div className="text-sm text-gray-600 mt-1">61-90 Days</div>
              <div className="text-lg font-semibold text-orange-700 mt-2">${outstandingByBucket['61-90'].toLocaleString()}</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg border-2 border-red-200">
              <div className="text-2xl font-bold text-red-600">{claimsByAging['90+'].length}</div>
              <div className="text-sm text-gray-600 mt-1">90+ Days</div>
              <div className="text-lg font-semibold text-red-700 mt-2">${outstandingByBucket['90+'].toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Claims Requiring Immediate Attention */}
        {filteredClaims.filter(c => {
          const priority = getClaimPriority(c);
          return priority.score >= 4 && c.status !== 'Paid' && c.status !== 'Closed';
        }).length > 0 && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Claims Requiring Immediate Attention
            </h3>
            <div className="space-y-2">
              {filteredClaims.filter(c => {
                const priority = getClaimPriority(c);
                return priority.score >= 4 && c.status !== 'Paid' && c.status !== 'Closed';
              }).map((claim, idx) => {
                const days = Math.floor((new Date() - new Date(claim.dateOfService)) / (1000 * 60 * 60 * 24));
                const priority = getClaimPriority(claim);
                return (
                  <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-300">
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{claim.patientName} - {claim.patientId}</div>
                      <div className="text-sm text-gray-600">{claim.insurance} • {claim.procedure}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-800">${parseFloat(claim.amount).toLocaleString()}</div>
                        <div className="text-xs text-gray-600">{days} days old</div>
                      </div>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        priority.score === 5 ? 'bg-red-200 text-red-800' : 'bg-orange-200 text-orange-800'
                      }`}>
                        {priority.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search claims by patient, ID, or insurance..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="w-full pl-10 pr-4 py-2 border rounded-lg" 
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Insurance</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date of Service</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days Out</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Procedure</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredClaims.map((claim) => {
                  const days = Math.floor((new Date() - new Date(claim.dateOfService)) / (1000 * 60 * 60 * 24));
                  const priority = getClaimPriority(claim);
                  
                  return (
                    <tr key={claim.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          priority.score === 5 ? 'bg-red-100 text-red-800' :
                          priority.score === 4 ? 'bg-orange-100 text-orange-800' :
                          priority.score === 3 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {priority.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-800">{claim.patientName}</div>
                        <div className="text-xs text-gray-500">{claim.patientId}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{claim.insurance}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{new Date(claim.dateOfService).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <span className={`text-sm font-medium ${
                          days > 90 ? 'text-red-600' :
                          days > 60 ? 'text-orange-600' :
                          days > 30 ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>
                          {days} days
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{claim.procedure}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">${parseFloat(claim.amount).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          claim.status === 'Paid' ? 'bg-green-100 text-green-800' :
                          claim.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          claim.status === 'Denied' ? 'bg-red-100 text-red-800' :
                          claim.status === 'Resubmitted' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {claim.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => { setEditingItem(claim); setFormData(claim); setShowAddModal(true); }} 
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <Edit2 className="w-4 h-4 text-gray-600" />
                          </button>
                          <button 
                            onClick={() => deleteClaim(claim.id)} 
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredClaims.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? 'No claims match your search' : 'No claims yet. Add your first claim above!'}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Payments View
  const PaymentsView = () => {
    const filteredPayments = payments.filter(p => 
      searchTerm === '' || 
      p.payer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.patientName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPayments = payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    const thisMonthPayments = payments.filter(p => {
      const date = new Date(p.date);
      return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
    }).reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Payments</h2>
          <button 
            onClick={() => { setShowAddModal(true); resetForm(); }} 
            className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white font-medium" 
            style={{ backgroundColor: csdGold }}
          >
            <Plus className="w-5 h-5" />
            <span>New Payment</span>
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-100 text-sm">Total Payments</span>
              <DollarSign className="w-5 h-5 text-green-200" />
            </div>
            <div className="text-3xl font-bold">${totalPayments.toLocaleString()}</div>
            <div className="text-green-100 text-xs mt-2">All time</div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-100 text-sm">This Month</span>
              <Calendar className="w-5 h-5 text-blue-200" />
            </div>
            <div className="text-3xl font-bold">${thisMonthPayments.toLocaleString()}</div>
            <div className="text-blue-100 text-xs mt-2">{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-100 text-sm">Total Transactions</span>
              <FileText className="w-5 h-5 text-purple-200" />
            </div>
            <div className="text-3xl font-bold">{payments.length}</div>
            <div className="text-purple-100 text-xs mt-2">Recorded</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search payments by payer or patient..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="w-full pl-10 pr-4 py-2 border rounded-lg" 
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-700">{new Date(payment.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{payment.payer}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{payment.patientName || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        payment.method === 'EFT' ? 'bg-green-100 text-green-800' :
                        payment.method === 'Check' ? 'bg-blue-100 text-blue-800' :
                        payment.method === 'Credit Card' ? 'bg-purple-100 text-purple-800' :
                        payment.method === 'Cash' ? 'bg-amber-100 text-amber-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {payment.method}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-800">${parseFloat(payment.amount).toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{payment.notes ? payment.notes.substring(0, 50) + (payment.notes.length > 50 ? '...' : '') : '-'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => { setEditingItem(payment); setFormData(payment); setShowAddModal(true); }} 
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Edit2 className="w-4 h-4 text-gray-600" />
                        </button>
                        <button 
                          onClick={() => deletePayment(payment.id)} 
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredPayments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? 'No payments match your search' : 'No payments yet. Add your first payment above!'}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Patients View
  const PatientsView = () => {
    const filteredPatients = patients.filter(p => 
      searchTerm === '' || 
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.patientId?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalBalance = patients.reduce((sum, p) => sum + (parseFloat(p.balance) || 0), 0);
    const patientsWithBalance = patients.filter(p => parseFloat(p.balance || 0) > 0).length;
    const avgBalance = patientsWithBalance > 0 ? totalBalance / patientsWithBalance : 0;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Patient A/R Management</h2>
          <button 
            onClick={() => { setShowAddModal(true); resetForm(); }} 
            className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white font-medium" 
            style={{ backgroundColor: csdGold }}
          >
            <Plus className="w-5 h-5" />
            <span>New Patient</span>
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-red-100 text-sm">Total A/R Balance</span>
              <DollarSign className="w-5 h-5 text-red-200" />
            </div>
            <div className="text-3xl font-bold">${totalBalance.toLocaleString()}</div>
            <div className="text-red-100 text-xs mt-2">Outstanding</div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-orange-100 text-sm">Patients w/ Balance</span>
              <Users className="w-5 h-5 text-orange-200" />
            </div>
            <div className="text-3xl font-bold">{patientsWithBalance}</div>
            <div className="text-orange-100 text-xs mt-2">Need follow-up</div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-100 text-sm">Avg Balance</span>
              <DollarSign className="w-5 h-5 text-blue-200" />
            </div>
            <div className="text-3xl font-bold">${avgBalance.toLocaleString()}</div>
            <div className="text-blue-100 text-xs mt-2">Per patient</div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-100 text-sm">Total Patients</span>
              <Users className="w-5 h-5 text-green-200" />
            </div>
            <div className="text-3xl font-bold">{patients.length}</div>
            <div className="text-green-100 text-xs mt-2">In system</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search patients by name or ID..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="w-full pl-10 pr-4 py-2 border rounded-lg" 
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{patient.patientId}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{patient.name}</td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-semibold ${
                        parseFloat(patient.balance || 0) > 1000 ? 'text-red-600' :
                        parseFloat(patient.balance || 0) > 500 ? 'text-orange-600' :
                        parseFloat(patient.balance || 0) > 0 ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        ${parseFloat(patient.balance || 0).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        patient.contactStatus === 'Contacted' ? 'bg-green-100 text-green-800' :
                        patient.contactStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        patient.contactStatus === 'Payment Plan' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {patient.contactStatus || 'Not Contacted'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{patient.lastContact ? new Date(patient.lastContact).toLocaleDateString() : '-'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => { setEditingItem(patient); setFormData(patient); setShowAddModal(true); }} 
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Edit2 className="w-4 h-4 text-gray-600" />
                        </button>
                        <button 
                          onClick={() => deletePatient(patient.id)} 
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredPatients.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? 'No patients match your search' : 'No patients yet. Add your first patient above!'}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // PreAuths View
  const PreAuthsView = () => {
    const filteredPreauths = preauths.filter(p => 
      searchTerm === '' || 
      p.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.patientId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.insurance?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalApproved = preauths.filter(p => p.status === 'Approved').reduce((sum, p) => sum + (parseFloat(p.approvedAmount) || 0), 0);
    const pendingCount = preauths.filter(p => p.status === 'Pending' || p.status === 'Submitted').length;
    const approvedCount = preauths.filter(p => p.status === 'Approved').length;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Pre-Authorizations</h2>
          <button 
            onClick={() => { setShowAddModal(true); resetForm(); }} 
            className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white font-medium" 
            style={{ backgroundColor: csdGold }}
          >
            <Plus className="w-5 h-5" />
            <span>New Pre-Auth</span>
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-100 text-sm">Total Approved</span>
              <CheckCircle className="w-5 h-5 text-green-200" />
            </div>
            <div className="text-3xl font-bold">${totalApproved.toLocaleString()}</div>
            <div className="text-green-100 text-xs mt-2">{approvedCount} pre-auths</div>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-yellow-100 text-sm">Pending</span>
              <Clock className="w-5 h-5 text-yellow-200" />
            </div>
            <div className="text-3xl font-bold">{pendingCount}</div>
            <div className="text-yellow-100 text-xs mt-2">Awaiting response</div>
          </div>
          
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-red-100 text-sm">Denied</span>
              <AlertCircle className="w-5 h-5 text-red-200" />
            </div>
            <div className="text-3xl font-bold">{preauths.filter(p => p.status === 'Denied').length}</div>
            <div className="text-red-100 text-xs mt-2">Need follow-up</div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-100 text-sm">Total Pre-Auths</span>
              <FileText className="w-5 h-5 text-blue-200" />
            </div>
            <div className="text-3xl font-bold">{preauths.length}</div>
            <div className="text-blue-100 text-xs mt-2">All time</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search pre-auths by patient, ID, or insurance..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="w-full pl-10 pr-4 py-2 border rounded-lg" 
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Insurance</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Procedure</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date Submitted</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Approved Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredPreauths.map((preauth) => (
                  <tr key={preauth.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-800">{preauth.patientName}</div>
                      <div className="text-xs text-gray-500">{preauth.patientId}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{preauth.insurance}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{preauth.procedure}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{new Date(preauth.dateSubmitted).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        preauth.status === 'Approved' ? 'bg-green-100 text-green-800' :
                        preauth.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        preauth.status === 'Denied' ? 'bg-red-100 text-red-800' :
                        preauth.status === 'Expired' ? 'bg-gray-100 text-gray-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {preauth.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">
                      {preauth.approvedAmount ? '$' + parseFloat(preauth.approvedAmount).toLocaleString() : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => { setEditingItem(preauth); setFormData(preauth); setShowAddModal(true); }} 
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Edit2 className="w-4 h-4 text-gray-600" />
                        </button>
                        <button 
                          onClick={() => deletePreauth(preauth.id)} 
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredPreauths.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? 'No pre-auths match your search' : 'No pre-authorizations yet. Add your first one above!'}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Insurance View
  const InsuranceView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Insurance Management</h2>
      </div>

      {/* EFT Enrollment Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">EFT Enrollment & Network Status</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Insurance</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fee Schedule</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Portal Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">EFT Status</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Dr. Gajjar</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Dr. Judge</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Dr. Strachan</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {insurancePortals.map((portal, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{portal.name}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      portal.feeSchedule === 'Direct' ? 'bg-blue-100 text-blue-800' :
                      portal.feeSchedule === 'Connection' ? 'bg-purple-100 text-purple-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {portal.feeSchedule}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      {portal.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {portal.eftStatus}
                    </span>
                  </td>
                  {providers.map(provider => (
                    <td key={provider} className="px-4 py-3">
                      <div className="flex items-center justify-center">
                        {portal.providers[provider] === 'In-Network' ? (
                          <div className="flex items-center gap-1 text-green-700">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-xs font-medium">In</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-red-700">
                            <X className="w-4 h-4" />
                            <span className="text-xs font-medium">Out</span>
                          </div>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Legend */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700">Fee Schedules:</span>
              <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">Direct</span>
              <span className="text-xs text-gray-600 ml-1">- Direct contract with insurance</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">Connection</span>
              <span className="text-xs text-gray-600 ml-1">- Via Connection Dental network</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Decare</span>
              <span className="text-xs text-gray-600 ml-1">- Via Decare Dental network</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Portals</p>
              <p className="text-3xl font-bold mt-2">{insurancePortals.length}</p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">EFT Enrolled</p>
              <p className="text-3xl font-bold mt-2">{insurancePortals.filter(p => p.eftStatus === 'Enrolled').length}</p>
            </div>
            <DollarSign className="w-12 h-12 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Connection Network</p>
              <p className="text-3xl font-bold mt-2">{insurancePortals.filter(p => p.feeSchedule === 'Connection').length}</p>
            </div>
            <Shield className="w-12 h-12 text-purple-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm">Direct Contracts</p>
              <p className="text-3xl font-bold mt-2">{insurancePortals.filter(p => p.feeSchedule === 'Direct').length}</p>
            </div>
            <FileText className="w-12 h-12 text-indigo-200" />
          </div>
        </div>
      </div>

      {/* Provider-Specific Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Provider Network Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {providers.map(provider => {
            const inNetwork = insurancePortals.filter(p => p.providers[provider] === 'In-Network').length;
            const outNetwork = insurancePortals.filter(p => p.providers[provider] === 'Out-of-Network').length;
            const percentage = ((inNetwork / insurancePortals.length) * 100).toFixed(0);
            
            return (
              <div key={provider} className="p-4 border-2 border-gray-200 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">{provider}</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">In-Network:</span>
                    <span className="font-semibold text-green-600">{inNetwork} ({percentage}%)</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Out-of-Network:</span>
                    <span className="font-semibold text-red-600">{outNetwork}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // Scorecard View - Continued in next part due to size
  const ScorecardView = () => {
    const averages = calculateScorecardAverages;
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Practice Scorecard Metrics</h2>
          <button 
            onClick={() => { 
              setShowAddModal(true); 
              resetForm(); 
            }} 
            className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white font-medium" 
            style={{ backgroundColor: csdGold }}
          >
            <Plus className="w-5 h-5" />
            <span>Add Week</span>
          </button>
        </div>

        {/* Key Performance Indicators */}
        {averages && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white shadow-lg">
              <div className="text-xs text-blue-100 mb-1">Avg Show Rate (Dr)</div>
              <div className="text-2xl font-bold">{(parseFloat(averages.avgShowRateDr) * 100).toFixed(1)}%</div>
              <div className="text-xs text-blue-100 mt-1">Target: 90%+</div>
            </div>
            
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white shadow-lg">
              <div className="text-xs text-green-100 mb-1">Avg Show Rate (Hyg)</div>
              <div className="text-2xl font-bold">{(parseFloat(averages.avgShowRateHyg) * 100).toFixed(1)}%</div>
              <div className="text-xs text-green-100 mt-1">Target: 85%+</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white shadow-lg">
              <div className="text-xs text-purple-100 mb-1">Avg New Patients</div>
              <div className="text-2xl font-bold">{averages.avgNewPatients}</div>
              <div className="text-xs text-purple-100 mt-1">per week</div>
            </div>
            
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg p-4 text-white shadow-lg">
              <div className="text-xs text-amber-100 mb-1">TX Acceptance</div>
              <div className="text-2xl font-bold">{(parseFloat(averages.avgTreatmentAcceptance) * 100).toFixed(1)}%</div>
              <div className="text-xs text-amber-100 mt-1">Target: 50%+</div>
            </div>
            
            <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg p-4 text-white shadow-lg">
              <div className="text-xs text-teal-100 mb-1">Avg Collection Rate</div>
              <div className="text-2xl font-bold">{(parseFloat(averages.avgCollectionRate) * 100).toFixed(1)}%</div>
              <div className="text-xs text-teal-100 mt-1">Target: 95%+</div>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        {averages && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-600">Total TX Presented</div>
                <DollarSign className="w-5 h-5 text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-gray-800">${averages.totalTreatmentPresented.toLocaleString()}</div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-600">Total TX Accepted</div>
                <CheckCircle className="w-5 h-5 text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-gray-800">${averages.totalTreatmentAccepted.toLocaleString()}</div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-600">Total New Patients</div>
                <Users className="w-5 h-5 text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-gray-800">{averages.totalNewPatients}</div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-600">5★ Reviews</div>
                <Award className="w-5 h-5 text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-gray-800">{averages.totalFiveStarReviews}</div>
            </div>
          </div>
        )}

        {/* Weekly Metrics Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Week</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase">Show Rate Dr</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase">Show Rate Hyg</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase">New Pts</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase">TX Presented</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase">TX Accept %</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase">TX Accepted</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase">Collection %</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase">5★</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {scorecardMetrics.map((metric, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-3 py-3 text-sm font-medium text-gray-800">{metric.weekNumber}</td>
                    <td className="px-3 py-3 text-sm text-gray-700">{new Date(metric.weekOf).toLocaleDateString()}</td>
                    <td className="px-3 py-3 text-center">
                      <span className={`text-sm font-medium ${
                        parseFloat(metric.showRateDr) >= 0.90 ? 'text-green-600' :
                        parseFloat(metric.showRateDr) >= 0.80 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {metric.showRateDr ? (parseFloat(metric.showRateDr) * 100).toFixed(0) + '%' : '-'}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className={`text-sm font-medium ${
                        parseFloat(metric.showRateHyg) >= 0.85 ? 'text-green-600' :
                        parseFloat(metric.showRateHyg) >= 0.75 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {metric.showRateHyg ? (parseFloat(metric.showRateHyg) * 100).toFixed(0) + '%' : '-'}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center text-sm font-semibold text-gray-800">{metric.newPatients || '-'}</td>
                    <td className="px-3 py-3 text-right text-sm text-gray-700">
                      {metric.treatmentPresented ? '$' + parseFloat(metric.treatmentPresented).toLocaleString() : '-'}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className={`text-sm font-medium ${
                        parseFloat(metric.treatmentAcceptanceRate) >= 0.50 ? 'text-green-600' :
                        parseFloat(metric.treatmentAcceptanceRate) >= 0.30 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {metric.treatmentAcceptanceRate ? (parseFloat(metric.treatmentAcceptanceRate) * 100).toFixed(0) + '%' : '-'}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right text-sm font-semibold text-gray-800">
                      {metric.treatmentAccepted ? '$' + parseFloat(metric.treatmentAccepted).toLocaleString() : '-'}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className={`text-sm font-medium ${
                        parseFloat(metric.collectionRate) >= 0.95 ? 'text-green-600' :
                        parseFloat(metric.collectionRate) >= 0.85 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {metric.collectionRate ? (parseFloat(metric.collectionRate) * 100).toFixed(0) + '%' : '-'}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center text-sm text-gray-700">{metric.fiveStarReviews || 0}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-center space-x-2">
                        <button 
                          onClick={() => { 
                            setEditingItem(metric); 
                            setFormData(metric); 
                            setShowAddModal(true); 
                          }} 
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Edit2 className="w-4 h-4 text-gray-600" />
                        </button>
                        <button 
                          onClick={() => deleteScorecardMetric(metric.id)} 
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {scorecardMetrics.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No scorecard metrics yet. Add your first week above!
              </div>
            )}
          </div>
        </div>

        {/* Trends Chart */}
        {scorecardMetrics.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Weekly Trends</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Show Rate Trend */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Show Rates</h4>
                <div className="space-y-2">
                  {scorecardMetrics.slice(-8).map((metric, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 w-16">Wk {metric.weekNumber}</span>
                      <div className="flex-1 flex gap-2">
                        <div className="flex-1">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${(parseFloat(metric.showRateDr) || 0) * 100}%` }}
                            />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${(parseFloat(metric.showRateHyg) || 0) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-end gap-4 mt-3 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span className="text-gray-600">Dr</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="text-gray-600">Hyg</span>
                  </div>
                </div>
              </div>

              {/* Treatment Acceptance Trend */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Treatment Acceptance</h4>
                <div className="space-y-2">
                  {scorecardMetrics.slice(-8).map((metric, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 w-16">Wk {metric.weekNumber}</span>
                      <div className="flex-1">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(parseFloat(metric.treatmentAcceptanceRate) || 0) * 100}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-xs font-medium text-gray-700 w-12 text-right">
                        {metric.treatmentAcceptanceRate ? (parseFloat(metric.treatmentAcceptanceRate) * 100).toFixed(0) + '%' : '-'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Checklist View
  const ChecklistView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">RCM Checklists</h2>
      </div>

      {/* Daily Checklist */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Daily RCM Checklist</h3>
          <div className="flex gap-2">
            <button 
              onClick={() => {
                const allComplete = dailyTasks.map(t => ({ ...t, completed: true }));
                setDailyTasks(allComplete);
                saveData('dailyTasks', allComplete);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              Mark All Complete
            </button>
            <button 
              onClick={resetDailyTasks}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Reset for Tomorrow
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dailyTasks.map((task, idx) => (
            <div 
              key={idx} 
              className={`p-4 border-2 rounded-lg hover:border-blue-300 transition-colors cursor-pointer ${
                task.completed ? 'bg-green-50 border-green-300' : 'border-gray-200'
              }`}
              onClick={() => toggleDailyTask(idx)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className={`text-sm font-medium transition-colors ${
                    task.completed ? 'text-green-700 line-through' : 'text-gray-800'
                  }`}>
                    {task.task}
                  </p>
                </div>
                <input 
                  type="checkbox" 
                  checked={task.completed}
                  onChange={() => toggleDailyTask(idx)}
                  className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                <Clock className="w-3 h-3" />
                <span>{task.time}</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium text-gray-800">
              {dailyTasks.filter(t => t.completed).length} / {dailyTasks.length} completed
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(dailyTasks.filter(t => t.completed).length / dailyTasks.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Weekly Tasks */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Weekly Tasks</h3>
        <div className="space-y-3">
          {weeklyTasks.map((task, idx) => (
            <div 
              key={idx} 
              className={`flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer ${
                task.completed ? 'bg-green-50' : 'bg-gray-50'
              }`}
              onClick={() => toggleWeeklyTask(idx)}
            >
              <input 
                type="checkbox" 
                checked={task.completed}
                onChange={() => toggleWeeklyTask(idx)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" 
              />
              <span className={`text-sm ${task.completed ? 'text-green-700 line-through' : 'text-gray-700'}`}>
                {task.task}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Tasks */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Tasks</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {monthlyTasks.map((task, idx) => (
            <div 
              key={idx} 
              className={`flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer ${
                task.completed ? 'bg-green-50' : 'bg-gray-50'
              }`}
              onClick={() => toggleMonthlyTask(idx)}
            >
              <input 
                type="checkbox" 
                checked={task.completed}
                onChange={() => toggleMonthlyTask(idx)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" 
              />
              <span className={`text-sm ${task.completed ? 'text-green-700 line-through' : 'text-gray-700'}`}>
                {task.task}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Modal Component for Add/Edit Forms
  const Modal = () => {
    if (!showAddModal) return null;

    const getModalTitle = () => {
      if (editingItem) {
        return `Edit ${currentView.charAt(0).toUpperCase() + currentView.slice(1, -1)}`;
      }
      return `New ${currentView.charAt(0).toUpperCase() + currentView.slice(1, -1)}`;
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">{getModalTitle()}</h3>
            <button onClick={() => { setShowAddModal(false); resetForm(); }}>
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Claims Form Fields */}
            {currentView === 'claims' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Patient ID</label>
                    <input 
                      type="text" 
                      value={formData.patientId || ''} 
                      onChange={(e) => setFormData({...formData, patientId: e.target.value})} 
                      className="w-full px-3 py-2 border rounded-lg" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                    <input 
                      type="text" 
                      value={formData.patientName || ''} 
                      onChange={(e) => setFormData({...formData, patientName: e.target.value})} 
                      className="w-full px-3 py-2 border rounded-lg" 
                      required 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Insurance</label>
                    <input 
                      type="text" 
                      value={formData.insurance || ''} 
                      onChange={(e) => setFormData({...formData, insurance: e.target.value})} 
                      className="w-full px-3 py-2 border rounded-lg" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Service</label>
                    <input 
                      type="date" 
                      value={formData.dateOfService || ''} 
                      onChange={(e) => setFormData({...formData, dateOfService: e.target.value})} 
                      className="w-full px-3 py-2 border rounded-lg" 
                      required 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Procedure</label>
                    <input 
                      type="text" 
                      value={formData.procedure || ''} 
                      onChange={(e) => setFormData({...formData, procedure: e.target.value})} 
                      className="w-full px-3 py-2 border rounded-lg" 
                      placeholder="D2740, Crown, etc." 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      value={formData.amount || ''} 
                      onChange={(e) => setFormData({...formData, amount: e.target.value})} 
                      className="w-full px-3 py-2 border rounded-lg" 
                      placeholder="0.00" 
                      required 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select 
                      value={formData.status || 'Pending'} 
                      onChange={(e) => setFormData({...formData, status: e.target.value})} 
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option>Pending</option>
                      <option>Submitted</option>
                      <option>Resubmitted</option>
                      <option>Approved</option>
                      <option>Paid</option>
                      <option>Denied</option>
                      <option>Additional Info Required</option>
                      <option>In Process</option>
                      <option>Closed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                    <input 
                      type="text" 
                      value={formData.assignedTo || ''} 
                      onChange={(e) => setFormData({...formData, assignedTo: e.target.value})} 
                      className="w-full px-3 py-2 border rounded-lg" 
                      placeholder="Staff member name" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea 
                    value={formData.notes || ''} 
                    onChange={(e) => setFormData({...formData, notes: e.target.value})} 
                    className="w-full px-3 py-2 border rounded-lg" 
                    rows="3" 
                  />
                </div>
              </>
            )}

            {/* Payments Form Fields */}
            {currentView === 'payments' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input 
                    type="date" 
                    value={formData.date || ''} 
                    onChange={(e) => setFormData({...formData, date: e.target.value})} 
                    className="w-full px-3 py-2 border rounded-lg" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payer</label>
                  <input 
                    type="text" 
                    value={formData.payer || ''} 
                    onChange={(e) => setFormData({...formData, payer: e.target.value})} 
                    className="w-full px-3 py-2 border rounded-lg" 
                    placeholder="Insurance company or patient" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name (Optional)</label>
                  <input 
                    type="text" 
                    value={formData.patientName || ''} 
                    onChange={(e) => setFormData({...formData, patientName: e.target.value})} 
                    className="w-full px-3 py-2 border rounded-lg" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                  <select 
                    value={formData.method || 'EFT'} 
                    onChange={(e) => setFormData({...formData, method: e.target.value})} 
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option>EFT</option>
                    <option>Check</option>
                    <option>Cash</option>
                    <option>Credit Card</option>
                    <option>Wire Transfer</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    value={formData.amount || ''} 
                    onChange={(e) => setFormData({...formData, amount: e.target.value})} 
                    className="w-full px-3 py-2 border rounded-lg" 
                    placeholder="0.00" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea 
                    value={formData.notes || ''} 
                    onChange={(e) => setFormData({...formData, notes: e.target.value})} 
                    className="w-full px-3 py-2 border rounded-lg" 
                    rows="3" 
                  />
                </div>
              </>
            )}

            {/* Patients Form Fields */}
            {currentView === 'patients' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Patient ID</label>
                  <input 
                    type="text" 
                    value={formData.patientId || ''} 
                    onChange={(e) => setFormData({...formData, patientId: e.target.value})} 
                    className="w-full px-3 py-2 border rounded-lg" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                  <input 
                    type="text" 
                    value={formData.name || ''} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    className="w-full px-3 py-2 border rounded-lg" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Balance</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    value={formData.balance || ''} 
                    onChange={(e) => setFormData({...formData, balance: e.target.value})} 
                    className="w-full px-3 py-2 border rounded-lg" 
                    placeholder="0.00" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Status</label>
                  <select 
                    value={formData.contactStatus || 'Not Contacted'} 
                    onChange={(e) => setFormData({...formData, contactStatus: e.target.value})} 
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option>Not Contacted</option>
                    <option>Pending</option>
                    <option>Contacted</option>
                    <option>Payment Plan</option>
                    <option>Collections</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Contact Date</label>
                  <input 
                    type="date" 
                    value={formData.lastContact || ''} 
                    onChange={(e) => setFormData({...formData, lastContact: e.target.value})} 
                    className="w-full px-3 py-2 border rounded-lg" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea 
                    value={formData.notes || ''} 
                    onChange={(e) => setFormData({...formData, notes: e.target.value})} 
                    className="w-full px-3 py-2 border rounded-lg" 
                    rows="3" 
                    placeholder="Payment arrangements, contact attempts, etc." 
                  />
                </div>
              </>
            )}

            {/* PreAuths Form Fields */}
            {currentView === 'preauths' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Patient ID</label>
                  <input 
                    type="text" 
                    value={formData.patientId || ''} 
                    onChange={(e) => setFormData({...formData, patientId: e.target.value})} 
                    className="w-full px-3 py-2 border rounded-lg" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                  <input 
                    type="text" 
                    value={formData.patientName || ''} 
                    onChange={(e) => setFormData({...formData, patientName: e.target.value})} 
                    className="w-full px-3 py-2 border rounded-lg" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Insurance</label>
                  <input 
                    type="text" 
                    value={formData.insurance || ''} 
                    onChange={(e) => setFormData({...formData, insurance: e.target.value})} 
                    className="w-full px-3 py-2 border rounded-lg" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Procedure</label>
                  <input 
                    type="text" 
                    value={formData.procedure || ''} 
                    onChange={(e) => setFormData({...formData, procedure: e.target.value})} 
                    className="w-full px-3 py-2 border rounded-lg" 
                    placeholder="Crown, Root Canal, etc." 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date Submitted</label>
                  <input 
                    type="date" 
                    value={formData.dateSubmitted || ''} 
                    onChange={(e) => setFormData({...formData, dateSubmitted: e.target.value})} 
                    className="w-full px-3 py-2 border rounded-lg" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select 
                    value={formData.status || 'Submitted'} 
                    onChange={(e) => setFormData({...formData, status: e.target.value})} 
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option>Submitted</option>
                    <option>Pending</option>
                    <option>Approved</option>
                    <option>Denied</option>
                    <option>Expired</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Approved Amount (if approved)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    value={formData.approvedAmount || ''} 
                    onChange={(e) => setFormData({...formData, approvedAmount: e.target.value})} 
                    className="w-full px-3 py-2 border rounded-lg" 
                    placeholder="0.00" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea 
                    value={formData.notes || ''} 
                    onChange={(e) => setFormData({...formData, notes: e.target.value})} 
                    className="w-full px-3 py-2 border rounded-lg" 
                    rows="3" 
                    placeholder="Reference numbers, special conditions, etc." 
                  />
                </div>
              </>
            )}

            {/* Scorecard Form Fields */}
            {currentView === 'scorecard' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Week Number</label>
                    <input 
                      type="number" 
                      value={formData.weekNumber || ''} 
                      onChange={(e) => setFormData({...formData, weekNumber: e.target.value})} 
                      className="w-full px-3 py-2 border rounded-lg" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Week Of (Date)</label>
                    <input 
                      type="date" 
                      value={formData.weekOf || ''} 
                      onChange={(e) => setFormData({...formData, weekOf: e.target.value})} 
                      className="w-full px-3 py-2 border rounded-lg" 
                      required 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Show Rate - Dr (%)</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      min="0" 
                      max="1"
                      value={formData.showRateDr || ''} 
                      onChange={(e) => setFormData({...formData, showRateDr: e.target.value})} 
                      className="w-full px-3 py-2 border rounded-lg" 
                      placeholder="0.85 for 85%"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Show Rate - Hyg (%)</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      min="0" 
                      max="1"
                      value={formData.showRateHyg || ''} 
                      onChange={(e) => setFormData({...formData, showRateHyg: e.target.value})} 
                      className="w-full px-3 py-2 border rounded-lg" 
                      placeholder="0.75 for 75%"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Patients (#)</label>
                    <input 
                      type="number" 
                      value={formData.newPatients || ''} 
                      onChange={(e) => setFormData({...formData, newPatients: e.target.value})} 
                      className="w-full px-3 py-2 border rounded-lg" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Treatment Presented ($)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      value={formData.treatmentPresented || ''} 
                      onChange={(e) => setFormData({...formData, treatmentPresented: e.target.value})} 
                      className="w-full px-3 py-2 border rounded-lg" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">TX Acceptance Rate</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      min="0" 
                      max="1"
                      value={formData.treatmentAcceptanceRate || ''} 
                      onChange={(e) => setFormData({...formData, treatmentAcceptanceRate: e.target.value})} 
                      className="w-full px-3 py-2 border rounded-lg" 
                      placeholder="0.50 for 50%"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">TX Accepted ($)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      value={formData.treatmentAccepted || ''} 
                      onChange={(e) => setFormData({...formData, treatmentAccepted: e.target.value})} 
                      className="w-full px-3 py-2 border rounded-lg" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Collection Rate</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      min="0" 
                      max="1"
                      value={formData.collectionRate || ''} 
                      onChange={(e) => setFormData({...formData, collectionRate: e.target.value})} 
                      className="w-full px-3 py-2 border rounded-lg" 
                      placeholder="0.95 for 95%"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">5★ Reviews (#)</label>
                    <input 
                      type="number" 
                      value={formData.fiveStarReviews || ''} 
                      onChange={(e) => setFormData({...formData, fiveStarReviews: e.target.value})} 
                      className="w-full px-3 py-2 border rounded-lg" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea 
                    value={formData.notes || ''} 
                    onChange={(e) => setFormData({...formData, notes: e.target.value})} 
                    className="w-full px-3 py-2 border rounded-lg" 
                    rows="3"
                  />
                </div>
              </>
            )}

            <div className="flex space-x-3 pt-4">
              <button 
                type="submit" 
                className="flex-1 px-4 py-2 rounded-lg text-white font-medium" 
                style={{ backgroundColor: csdGold }}
              >
                {editingItem ? 'Update' : 'Create'}
              </button>
              <button 
                type="button" 
                onClick={() => { setShowAddModal(false); resetForm(); }} 
                className="px-4 py-2 bg-gray-200 rounded-lg font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'claims', name: 'Claims', icon: FileText },
    { id: 'payments', name: 'Payments', icon: DollarSign },
    { id: 'patients', name: 'Patients', icon: Users },
    { id: 'preauths', name: 'Pre-Auths', icon: FileText },
    { id: 'insurance', name: 'Insurance', icon: Shield },
    { id: 'scorecard', name: 'Scorecard', icon: Award },
    { id: 'checklist', name: 'Checklist', icon: List }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold" style={{ color: csdGold }}>
            Court Street Dental RCM Dashboard
          </h1>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white shadow mb-6">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8 overflow-x-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    currentView === item.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {currentView === 'dashboard' && <DashboardView />}
        {currentView === 'claims' && <ClaimsView />}
        {currentView === 'payments' && <PaymentsView />}
        {currentView === 'patients' && <PatientsView />}
        {currentView === 'preauths' && <PreAuthsView />}
        {currentView === 'insurance' && <InsuranceView />}
        {currentView === 'scorecard' && <ScorecardView />}
        {currentView === 'checklist' && <ChecklistView />}
      </div>

      {/* Modal */}
      <Modal />
    </div>
  );
};

export default CourtStreetRCM;
