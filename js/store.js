// ============================================
// SpendSmart — Data Store (localStorage)
// ============================================

const Store = (() => {

  const KEY = 'spendsmart_v3';

  let _data = [];

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      _data = raw ? JSON.parse(raw) : [];
      if (_data.length === 0) {
        _data = [...SAMPLE_DATA];
        save();
      }
    } catch {
      _data = [...SAMPLE_DATA];
    }
  }

  function save() {
    localStorage.setItem(KEY, JSON.stringify(_data));
  }

  function getAll() {
    return [..._data];
  }

  function getByMonth(month, year) {
    return _data.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === month && d.getFullYear() === year;
    });
  }

  function add(transaction) {
    _data.unshift(transaction);
    save();
  }

  function remove(id) {
    _data = _data.filter(t => t.id !== id);
    save();
  }

  function getCategoryInfo(name, type) {
    const list = CATEGORIES[type] || CATEGORIES.expense;
    return list.find(c => c.name === name) || { emoji: '📦', color: '#6b7280' };
  }

  function formatCurrency(amount) {
    return '₹' + Math.abs(amount).toLocaleString('en-IN', { maximumFractionDigits: 0 });
  }

  return { load, getAll, getByMonth, add, remove, getCategoryInfo, formatCurrency };

})();
