// ============================================
// SpendSmart — Configuration & Constants
// Author: Javvadi Shanmuk Sai Vardhan
// ============================================

const CATEGORIES = {
  expense: [
    { name: 'Food',          emoji: '🍔', color: '#ef4444' },
    { name: 'Transport',     emoji: '🚗', color: '#f97316' },
    { name: 'Shopping',      emoji: '🛍️', color: '#a855f7' },
    { name: 'Bills',         emoji: '📄', color: '#3b82f6' },
    { name: 'Health',        emoji: '🏥', color: '#10b981' },
    { name: 'Entertainment', emoji: '🎬', color: '#ec4899' },
    { name: 'Education',     emoji: '📚', color: '#6366f1' },
    { name: 'Dining',        emoji: '🍽️', color: '#f59e0b' },
    { name: 'Other',         emoji: '📦', color: '#6b7280' },
  ],
  income: [
    { name: 'Salary',     emoji: '💼', color: '#16a34a' },
    { name: 'Freelance',  emoji: '💻', color: '#0891b2' },
    { name: 'Investment', emoji: '📈', color: '#7c3aed' },
    { name: 'Gift',       emoji: '🎁', color: '#d97706' },
    { name: 'Other',      emoji: '💰', color: '#059669' },
  ],
};

const SAMPLE_DATA = (() => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  return [
    { id: 1,  name: 'Monthly Salary',    amount: 45000, date: `${y}-${m}-01`, type: 'income',  category: 'Salary',        emoji: '💼', color: '#16a34a' },
    { id: 2,  name: 'Swiggy Dinner',     amount: 650,   date: `${y}-${m}-02`, type: 'expense', category: 'Food',          emoji: '🍔', color: '#ef4444' },
    { id: 3,  name: 'Ola to Office',     amount: 280,   date: `${y}-${m}-03`, type: 'expense', category: 'Transport',     emoji: '🚗', color: '#f97316' },
    { id: 4,  name: 'Airtel Bill',       amount: 599,   date: `${y}-${m}-04`, type: 'expense', category: 'Bills',         emoji: '📄', color: '#3b82f6' },
    { id: 5,  name: 'Weekend Movie',     amount: 750,   date: `${y}-${m}-05`, type: 'expense', category: 'Entertainment', emoji: '🎬', color: '#ec4899' },
    { id: 6,  name: 'Freelance Project', amount: 12000, date: `${y}-${m}-06`, type: 'income',  category: 'Freelance',     emoji: '💻', color: '#0891b2' },
    { id: 7,  name: 'Amazon Shopping',   amount: 3200,  date: `${y}-${m}-07`, type: 'expense', category: 'Shopping',      emoji: '🛍️', color: '#a855f7' },
    { id: 8,  name: 'Udemy Course',      amount: 499,   date: `${y}-${m}-08`, type: 'expense', category: 'Education',     emoji: '📚', color: '#6366f1' },
    { id: 9,  name: 'Doctor Visit',      amount: 800,   date: `${y}-${m}-08`, type: 'expense', category: 'Health',        emoji: '🏥', color: '#10b981' },
    { id: 10, name: 'Restaurant Dinner', amount: 1400,  date: `${y}-${m}-09`, type: 'expense', category: 'Dining',        emoji: '🍽️', color: '#f59e0b' },
  ];
})();
