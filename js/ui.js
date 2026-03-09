// ============================================
// SpendSmart — UI Rendering Module
// ============================================

const UI = (() => {

  // ── Toast ────────────────────────────────────
  let toastTimer = null;
  function toast(msg, icon = '✓') {
    const el = document.getElementById('toast');
    el.innerHTML = `<span>${icon}</span>${msg}`;
    el.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2500);
  }

  // ── Category chips ───────────────────────────
  function renderCategoryChips(type, selectedCat) {
    document.getElementById('catGrid').innerHTML = CATEGORIES[type].map(c => `
      <button class="cat-chip${selectedCat === c.name ? ' sel' : ''}" data-cat="${c.name}">
        ${c.emoji} ${c.name}
      </button>`
    ).join('');
  }

  // ── Sidebar summary ──────────────────────────
  function renderSidebar(income, expenses) {
    const net = income - expenses;
    const savRate = income > 0 ? Math.max(0, Math.round(((income - expenses) / income) * 100)) : 0;
    const circ = 2 * Math.PI * 22 * 0.95;

    document.getElementById('balAmt').textContent = Store.formatCurrency(net);
    document.getElementById('balAmt').className = 'bal-amount ' + (net >= 0 ? 'positive' : 'negative');
    document.getElementById('balInc').textContent = Store.formatCurrency(income);
    document.getElementById('balExp').textContent = Store.formatCurrency(expenses);

    const ring = document.getElementById('ringFill');
    ring.style.strokeDashoffset = circ - (circ * (savRate / 100));
    ring.style.stroke = savRate >= 30 ? '#4ade80' : savRate >= 10 ? '#facc15' : '#f87171';

    document.getElementById('ringPct').textContent = savRate + '%';
    document.getElementById('ringPct').style.color = ring.style.stroke;
  }

  // ── Summary cards ────────────────────────────
  function renderSummaryCards(income, expenses, incomeCount, expenseCount, daysInMonth) {
    const avg = expenses / daysInMonth;
    document.getElementById('scInc').textContent    = Store.formatCurrency(income);
    document.getElementById('scIncSub').textContent = `${incomeCount} transaction${incomeCount !== 1 ? 's' : ''}`;
    document.getElementById('scExp').textContent    = Store.formatCurrency(expenses);
    document.getElementById('scExpSub').textContent = `${expenseCount} transaction${expenseCount !== 1 ? 's' : ''}`;
    document.getElementById('scAvg').textContent    = Store.formatCurrency(avg);
    document.getElementById('scAvgSub').textContent = expenses > income ? '⚠ Overspending' : '✓ On track';
  }

  // ── 6-Month Bar Chart ────────────────────────
  function renderChart(viewMonth, viewYear) {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      let m = viewMonth - i, y = viewYear;
      if (m < 0) { m += 12; y--; }
      const mo  = Store.getByMonth(m, y);
      const exp = mo.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
      const inc = mo.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
      months.push({ m, y, exp, inc, label: new Date(y, m, 1).toLocaleDateString('en-US', { month: 'short' }) });
    }

    const maxVal = Math.max(...months.map(x => Math.max(x.exp, x.inc)), 1);
    const now = new Date();

    document.getElementById('monthlyChart').innerHTML = months.map(({ m, y, exp, inc, label }) => {
      const expH = (exp / maxVal) * 100;
      const incH = (inc / maxVal) * 100;
      const isCurrent = m === now.getMonth() && y === now.getFullYear();
      return `
        <div class="m-bar-wrap">
          <div class="m-bar-bg">
            <div class="m-bar-tooltip">${Store.formatCurrency(exp)} spent · ${Store.formatCurrency(inc)} earned</div>
            <div class="m-bar-income" style="height:${incH}%"></div>
            <div class="m-bar-fill${isCurrent ? ' current-month' : ''}" style="height:${expH}%"></div>
          </div>
          <div class="m-label">${label}</div>
        </div>`;
    }).join('');
  }

  // ── Category Breakdown ───────────────────────
  function renderBreakdown(monthTxns) {
    const exps  = monthTxns.filter(t => t.type === 'expense');
    const total = exps.reduce((s, t) => s + t.amount, 0);
    const bycat = {};
    exps.forEach(t => { bycat[t.category] = (bycat[t.category] || 0) + t.amount; });
    const sorted = Object.entries(bycat).sort((a, b) => b[1] - a[1]);

    const el = document.getElementById('catRows');
    if (!sorted.length) {
      el.innerHTML = '<div class="empty-state">No expenses this month.</div>';
      return;
    }

    el.innerHTML = sorted.map(([cat, amt]) => {
      const c   = Store.getCategoryInfo(cat, 'expense');
      const pct = total > 0 ? Math.round((amt / total) * 100) : 0;
      return `
        <div class="cat-row">
          <div class="cat-emoji-name">
            <span class="cat-emoji">${c.emoji}</span>
            <span class="cat-name-label">${cat}</span>
          </div>
          <div class="cat-bar-wrap">
            <div class="cat-bar" style="width:${pct}%;background:${c.color}"></div>
          </div>
          <div class="cat-pct">${pct}%</div>
          <div class="cat-sum">${Store.formatCurrency(amt)}</div>
        </div>`;
    }).join('');
  }

  // ── Transaction List ─────────────────────────
  function renderTransactions(monthTxns, filter, query) {
    let list = [...monthTxns];
    if (filter !== 'all')   list = list.filter(t => t.type === filter);
    if (query.trim())       list = list.filter(t =>
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.category.toLowerCase().includes(query.toLowerCase())
    );

    const el = document.getElementById('txnList');
    if (!list.length) {
      el.innerHTML = '<div class="txn-empty"><span>🔍</span>No transactions found.</div>';
      return;
    }

    el.innerHTML = list.map(t => {
      const d = new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
      return `
        <div class="txn-item" data-id="${t.id}">
          <div class="txn-icon">${t.emoji}</div>
          <div class="txn-body">
            <div class="txn-name">${t.name}</div>
            <div class="txn-meta"><span class="txn-cat-pill">${t.category}</span>${d}</div>
          </div>
          <div class="txn-right">
            <div class="txn-amount ${t.type}">${t.type === 'income' ? '+' : '−'}${Store.formatCurrency(t.amount)}</div>
            <button class="txn-del" data-id="${t.id}" title="Delete">✕</button>
          </div>
        </div>`;
    }).join('');
  }

  return { toast, renderCategoryChips, renderSidebar, renderSummaryCards, renderChart, renderBreakdown, renderTransactions };

})();
