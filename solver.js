/* =========================================================
   ExamSeat — solver.js
   All interactivity: nav, CO cards, CSP solver, seat map
   ========================================================= */

/* ── NAVIGATION ── */
function navTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ── CO CARDS ── */
function toggleCO(card) {
  const wasOpen = card.classList.contains('open');
  document.querySelectorAll('.co-card.open').forEach(c => c.classList.remove('open'));
  if (!wasOpen) card.classList.add('open');
}

function filterCO(type, btn) {
  document.querySelectorAll('.co-filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.co-card').forEach(card => {
    const show = type === 'all' || card.dataset.co === type;
    card.style.display = show ? '' : 'none';
    if (!show) card.classList.remove('open');
  });
}

/* ── SCROLL REVEAL ── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* =========================================================
   TRY IT — CSP SOLVER
   ========================================================= */

let tryStudents = [];
const classPalette = ['#3b82f6','#22c55e','#f59e0b','#ec4899','#8b5cf6','#ef4444','#14b8a6','#f97316','#6366f1','#84cc16'];
const classColorMap = {};
let classColorIdx = 0;

function getClassColor(cls) {
  if (!classColorMap[cls]) {
    classColorMap[cls] = classPalette[classColorIdx % classPalette.length];
    classColorIdx++;
  }
  return classColorMap[cls];
}

/* ── Add / Remove / Clear students ── */
function addTryStudent() {
  const n = document.getElementById('t-name').value.trim();
  const c = document.getElementById('t-class').value.trim().toUpperCase();
  const s = document.getElementById('t-sub').value.trim();
  const a = document.getElementById('t-sacc').checked;

  if (!n || !c || !s) {
    showInlineError('Please fill in Name, Class and Subject.');
    return;
  }
  tryStudents.push({ id: tryStudents.length + 1, name: n, cls: c, subject: s, accessible: a });
  document.getElementById('t-name').value = '';
  document.getElementById('t-class').value = '';
  document.getElementById('t-sub').value = '';
  document.getElementById('t-sacc').checked = false;
  document.getElementById('t-name').focus();
  renderStudentList();
}

function removeStudent(idx) {
  tryStudents.splice(idx, 1);
  tryStudents.forEach((s, i) => s.id = i + 1);
  renderStudentList();
}

function clearStudents() {
  tryStudents = [];
  renderStudentList();
}

function showInlineError(msg) {
  const msgEl = document.getElementById('t-msg');
  msgEl.className = 'msg-box msg-warn';
  msgEl.style.display = 'block';
  msgEl.innerHTML = `<p style="color:#f09c6b;font-size:0.88rem;">${msg}</p>`;
}

function renderStudentList() {
  const el = document.getElementById('t-studentlist');
  document.getElementById('t-count').textContent = tryStudents.length;

  if (!tryStudents.length) {
    el.innerHTML = '<p style="font-size:0.82rem;color:#5a5450;padding:4px 0;">No students yet.</p>';
    return;
  }

  el.innerHTML = tryStudents.map((s, i) => `
    <div class="student-row">
      <div class="student-dot" style="background:${getClassColor(s.cls)}"></div>
      <span class="student-name">${s.name}</span>
      <span class="student-cls">${s.cls}</span>
      <span class="student-sub">${s.subject}</span>
      ${s.accessible ? '<span style="font-size:0.75rem;">♿</span>' : ''}
      <button class="student-del" onclick="removeStudent(${i})">×</button>
    </div>`).join('');
}

/* ── Load sample data ── */
function loadSampleStudents() {
  tryStudents = [];
  classColorIdx = 0;
  Object.keys(classColorMap).forEach(k => delete classColorMap[k]);

  const data = [
    { name: 'Arjun',   cls: 'A', subject: 'Maths',     accessible: false },
    { name: 'Priya',   cls: 'A', subject: 'Maths',     accessible: false },
    { name: 'Rahul',   cls: 'B', subject: 'Physics',   accessible: false },
    { name: 'Sneha',   cls: 'A', subject: 'Chemistry', accessible: true  },
    { name: 'Karan',   cls: 'B', subject: 'Maths',     accessible: false },
    { name: 'Divya',   cls: 'C', subject: 'Physics',   accessible: false },
    { name: 'Arun',    cls: 'C', subject: 'Chemistry', accessible: false },
    { name: 'Meera',   cls: 'B', subject: 'Chemistry', accessible: false },
    { name: 'Vikram',  cls: 'A', subject: 'Physics',   accessible: false },
    { name: 'Lakshmi', cls: 'C', subject: 'Maths',     accessible: true  },
    { name: 'Suresh',  cls: 'D', subject: 'Biology',   accessible: false },
    { name: 'Ananya',  cls: 'D', subject: 'Biology',   accessible: false },
  ];
  data.forEach((s, i) => tryStudents.push({ ...s, id: i + 1 }));
  renderStudentList();
}

/* ── CSP helper: get neighbours ── */
function getNeighbors(r, c, rows, cols, adj) {
  const n = [];
  if (adj === 'h') {
    if (c > 0) n.push([r, c - 1]);
    if (c < cols - 1) n.push([r, c + 1]);
  } else if (adj === '4') {
    if (r > 0) n.push([r - 1, c]);
    if (r < rows - 1) n.push([r + 1, c]);
    if (c > 0) n.push([r, c - 1]);
    if (c < cols - 1) n.push([r, c + 1]);
  } else {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        if (r + dr >= 0 && r + dr < rows && c + dc >= 0 && c + dc < cols)
          n.push([r + dr, c + dc]);
      }
    }
  }
  return n;
}

/* ── CSP helper: check consistency ── */
function isConsistent(r, c, stu, grid, rows, cols, adj, noClass, noSub) {
  for (const [nr, nc] of getNeighbors(r, c, rows, cols, adj)) {
    const nb = grid[nr][nc];
    if (!nb) continue;
    if (noClass && nb.cls === stu.cls) return false;
    if (noSub && nb.subject === stu.subject) return false;
  }
  return true;
}

/* ── Main solver ── */
function runTrySolver() {
  const rows   = Math.max(2, Math.min(8,  +document.getElementById('t-rows').value || 4));
  const cols   = Math.max(2, Math.min(10, +document.getElementById('t-cols').value || 5));
  const adj    = document.getElementById('t-adj').value;
  const noClass = document.getElementById('t-noclass').checked;
  const noSub   = document.getElementById('t-nosub').checked;
  const acc     = document.getElementById('t-acc').checked;

  const totalSeats = rows * cols;
  document.getElementById('t-mseats').textContent = totalSeats;
  document.getElementById('t-mstu').textContent   = tryStudents.length;

  const msgEl  = document.getElementById('t-msg');
  msgEl.style.display = 'none';

  const trace = [];
  const tlog  = (msg, type) => trace.push({ msg, type });

  /* Validate */
  if (!tryStudents.length) {
    showInlineError('Add at least one student before running the solver.');
    return;
  }
  if (tryStudents.length > totalSeats) {
    document.getElementById('t-mstatus').innerHTML = '<span class="trace-fail">Over-constrained</span>';
    msgEl.className = 'msg-box msg-error';
    msgEl.style.display = 'block';
    msgEl.innerHTML = `<p style="color:#f87171;font-size:0.88rem;"><strong>Failed:</strong> ${tryStudents.length} students but only ${totalSeats} seats. Increase rows or columns.</p>`;
    tlog(`✗ Over-constrained: ${tryStudents.length} students > ${totalSeats} seats`, 'fail');
    renderTrace(trace);
    return;
  }

  /* Build grid */
  const grid = Array.from({ length: rows }, () => Array(cols).fill(null));
  const seatOrder = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      seatOrder.push([r, c]);

  tlog(`▶ Hall: ${rows}×${cols} = ${totalSeats} seats | Students: ${tryStudents.length}`, 'info');
  const constraintList = [noClass ? 'no-same-class' : '', noSub ? 'no-same-subject' : '', acc ? 'accessible-front' : ''].filter(Boolean).join(', ') || 'none';
  tlog(`  Constraints: ${constraintList} | Adj: ${adj}`, 'info');
  tlog('', '');

  /* Handle accessible students first */
  const accStus = tryStudents.filter(s => s.accessible);
  const regStus = tryStudents.filter(s => !s.accessible);

  if (acc && accStus.length) {
    const frontSeats = seatOrder.filter(([r]) => r === 0);
    let fi = 0;
    for (const s of accStus) {
      if (fi >= frontSeats.length) { tlog('  ✗ Not enough front seats for accessible students', 'fail'); break; }
      const [r, c] = frontSeats[fi++];
      grid[r][c] = s;
      tlog(`  ♿ ${s.name} [${s.cls}/${s.subject}] → seat (${r + 1},${c + 1})`, 'ok');
    }
  }

  /* Backtracking CSP */
  let backtracks = 0;
  const remaining = [...regStus, ...(acc ? [] : accStus)];

  function backtrack(idx) {
    if (idx === remaining.length) return true;
    const s = remaining[idx];
    const open = seatOrder.filter(([r, c]) => !grid[r][c]);
    for (const [r, c] of open) {
      const ok = isConsistent(r, c, s, grid, rows, cols, adj, noClass, noSub);
      tlog(`  ${ok ? '✓' : '✗'} ${s.name} [${s.cls}/${s.subject}] → (${r + 1},${c + 1}) ${ok ? 'OK' : 'conflict'}`, ok ? 'ok' : 'fail');
      if (ok) {
        grid[r][c] = s;
        if (backtrack(idx + 1)) return true;
        grid[r][c] = null;
        backtracks++;
        tlog(`  ↺ Backtrack from (${r + 1},${c + 1}) for ${s.name}`, 'info');
      }
    }
    return false;
  }

  const solved = backtrack(0);
  tlog('', '');

  if (solved) {
    tlog(`▶ Solution found! Backtracks: ${backtracks}`, 'ok');
    document.getElementById('t-mstatus').innerHTML = '<span class="trace-ok">Solved ✓</span>';
    msgEl.className = 'msg-box msg-success';
    msgEl.style.display = 'block';
    msgEl.innerHTML = `<p style="color:#86efac;font-size:0.88rem;">✓ Valid seating arrangement found! <strong>${tryStudents.length}</strong> students placed in ${rows}×${cols} hall. Backtracks: ${backtracks}.</p>`;
  } else {
    tlog('▶ No valid arrangement — constraints too strict.', 'fail');
    document.getElementById('t-mstatus').innerHTML = '<span class="trace-fail">Unsolvable</span>';
    msgEl.className = 'msg-box msg-error';
    msgEl.style.display = 'block';
    msgEl.innerHTML = `<p style="color:#f87171;font-size:0.88rem;">✗ Over-constrained: No valid arrangement satisfies all constraints. Try relaxing adjacency rules or increasing hall size.</p>`;
  }

  renderSeatMap(grid, rows, cols, acc);
  renderTrace(trace);
  renderLegend();
}

/* ── Render seat map ── */
function renderSeatMap(grid, rows, cols, acc) {
  const el = document.getElementById('t-seatmap');
  let html = '<div style="display:flex;flex-direction:column;gap:5px;overflow-x:auto;">';

  for (let r = 0; r < rows; r++) {
    html += `<div style="display:flex;gap:5px;align-items:center;">`;
    html += `<div style="font-size:10px;color:#5a5450;width:16px;text-align:center;flex-shrink:0;">${r + 1}</div>`;
    for (let c = 0; c < cols; c++) {
      const s = grid[r][c];
      const isAccRow = acc && r === 0;
      if (s) {
        const bg = getClassColor(s.cls);
        html += `
          <div title="${s.name} | Class: ${s.cls} | ${s.subject}"
            style="min-width:52px;height:50px;background:${bg}22;border:1px solid ${bg}55;border-radius:3px;
                   display:flex;flex-direction:column;align-items:center;justify-content:center;
                   font-size:9px;line-height:1.3;text-align:center;color:${bg};
                   cursor:default;transition:transform 0.15s;"
            onmouseover="this.style.transform='scale(1.08)'"
            onmouseout="this.style.transform=''">
            <span style="font-weight:600;">${s.name.substring(0, 6)}</span>
            <span style="opacity:0.75;">${s.cls}·${s.subject.substring(0, 4)}</span>
            ${s.accessible ? '<span>♿</span>' : ''}
          </div>`;
      } else {
        html += `<div style="min-width:52px;height:50px;
          background:${isAccRow ? '#1a2a3a' : '#0f0e0c'};
          border:1px solid ${isAccRow ? '#2a4a6a' : '#2e2c28'};
          border-radius:3px;display:flex;align-items:center;justify-content:center;
          font-size:11px;color:#3a3830;">${isAccRow ? '♿' : '·'}</div>`;
      }
    }
    html += '</div>';
  }
  html += '</div>';
  el.innerHTML = html;
}

/* ── Render trace ── */
function renderTrace(trace) {
  const el = document.getElementById('t-trace');
  if (!trace.length) { el.textContent = 'No trace yet.'; return; }
  el.innerHTML = trace.map(({ msg, type }) => {
    const cls = type === 'ok' ? 'trace-ok' : type === 'fail' ? 'trace-fail' : type === 'info' ? 'trace-info' : '';
    return `<div class="${cls}">${msg || '&nbsp;'}</div>`;
  }).join('');
  el.scrollTop = el.scrollHeight;
}

/* ── Render legend ── */
function renderLegend() {
  const el = document.getElementById('t-legend');
  el.style.display = 'flex';
  const classes = [...new Set(tryStudents.map(s => s.cls))];
  el.innerHTML = classes.map(cls => `
    <div style="display:flex;align-items:center;gap:5px;font-size:11px;color:#8a8070;">
      <div style="width:10px;height:10px;border-radius:50%;background:${getClassColor(cls)};"></div>
      Class ${cls}
    </div>`).join('');
}

/* ── Enter key support for add student form ── */
document.addEventListener('DOMContentLoaded', () => {
  ['t-name', 't-class', 't-sub'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('keydown', e => { if (e.key === 'Enter') addTryStudent(); });
  });
});
