// ============================================
// SpendSmart — Main App Controller
// ============================================

const App = (() => {

  let txnType    = 'expense';
  let selectedCat = '';
  let txnFilter  = 'all';
  let viewMonth  = new Date().getMonth();
  let viewYear   = new Date().getFullYear();

  // ── Helpers ──────────────────────────────────
  function monthName(m, y) {
    return new Date(y, m, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  // ── Full re-render ───────────────────────────
  function renderAll() {
    const monthTxns  = Store.getByMonth(viewMonth, viewYear);
    const income     = monthTxns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expenses   = monthTxns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const incCount   = monthTxns.filter(t => t.type === 'income').length;
    const expCount   = monthTxns.filter(t => t.type === 'expense').length;
    const daysInMo   = new Date(viewYear, viewMonth + 1, 0).getDate();

    document.getElementById('monthLabel').textContent = monthName(viewMonth, viewYear);

    UI.renderSidebar(income, expenses);
    UI.renderSummaryCards(income, expenses, incCount, expCount, daysInMo);
    UI.renderChart(viewMonth, viewYear);
    UI.renderBreakdown(monthTxns);
    renderTxns();
  }

  function renderTxns() {
    const monthTxns = Store.getByMonth(viewMonth, viewYear);
    const query = document.getElementById('searchInput').value;
    UI.renderTransactions(monthTxns, txnFilter, query);
  }

  // ── Set transaction type ─────────────────────
  function setType(type) {
    txnType = type;
    selectedCat = '';
    document.getElementById('btnExp').className = 't-btn' + (type === 'expense' ? ' act-exp' : '');
    document.getElementById('btnInc').className = 't-btn' + (type === 'income'  ? ' act-inc' : '');
    UI.renderCategoryChips(type, selectedCat);
  }

  // ── Add transaction ──────────────────────────
  function addTransaction() {
    const name = document.getElementById('fName').value.trim();
    const amt  = parseFloat(document.getElementById('fAmt').value);
    const date = document.getElementById('fDate').value;

    if (!name)             { UI.toast('Enter a description', '⚠'); return; }
    if (!amt || amt <= 0)  { UI.toast('Enter a valid amount', '⚠'); return; }
    if (!date)             { UI.toast('Select a date', '⚠'); return; }
    if (!selectedCat)      { UI.toast('Select a category', '⚠'); return; }

    const cat = Store.getCategoryInfo(selectedCat, txnType);
    Store.add({
      id: Date.now(), name, amount: amt, date,
      type: txnType, category: selectedCat,
      emoji: cat.emoji, color: cat.color,
    });

    document.getElementById('fName').value = '';
    document.getElementById('fAmt').value  = '';
    selectedCat = '';
    UI.renderCategoryChips(txnType, selectedCat);
    UI.toast(`${txnType === 'expense' ? 'Expense' : 'Income'} added!`, '✓');
    renderAll();
  }

  // ── Event delegation ─────────────────────────
  function bindEvents() {
    // Type toggle
    document.getElementById('btnExp').addEventListener('click', () => setType('expense'));
    document.getElementById('btnInc').addEventListener('click', () => setType('income'));

    // Category chips (delegated)
    document.getElementById('catGrid').addEventListener('click', e => {
      const chip = e.target.closest('.cat-chip');
      if (!chip) return;
      selectedCat = chip.dataset.cat;
      UI.renderCategoryChips(txnType, selectedCat);
    });

    // Add button
    document.getElementById('addBtn').addEventListener('click', addTransaction);

    // Enter key in inputs
    ['fName','fAmt','fDate'].forEach(id => {
      document.getElementById(id).addEventListener('keydown', e => {
        if (e.key === 'Enter') addTransaction();
      });
    });

    // Month navigation
    document.getElementById('prevMonth').addEventListener('click', () => {
      viewMonth--;
      if (viewMonth < 0) { viewMonth = 11; viewYear--; }
      renderAll();
    });
    document.getElementById('nextMonth').addEventListener('click', () => {
      viewMonth++;
      if (viewMonth > 11) { viewMonth = 0; viewYear++; }
      renderAll();
    });

    // Filter tabs
    document.querySelectorAll('.ftab').forEach(btn => {
      btn.addEventListener('click', () => {
        txnFilter = btn.dataset.filter;
        document.querySelectorAll('.ftab').forEach(b => b.classList.remove('act'));
        btn.classList.add('act');
        renderTxns();
      });
    });

    // Search
    document.getElementById('searchInput').addEventListener('input', renderTxns);

    // Delete (delegated on txn list)
    document.getElementById('txnList').addEventListener('click', e => {
      const btn = e.target.closest('.txn-del');
      if (!btn) return;
      Store.remove(Number(btn.dataset.id));
      UI.toast('Deleted', '🗑');
      renderAll();
    });
  }

  // ── Init ─────────────────────────────────────
  function init() {
    Store.load();
    document.getElementById('fDate').value = new Date().toISOString().split('T')[0];
    setType('expense');
    bindEvents();
    renderAll();
  }

  return { init };

})();

document.addEventListener('DOMContentLoaded', App.init);
