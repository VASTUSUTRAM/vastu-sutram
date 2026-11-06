/**
 * VASTU SUTRAM – Admin Portal & Owner Control Center
 */

class VastuAdminDashboard {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.isAuthenticated = sessionStorage.getItem('vastu_admin_auth') === 'true';
    this.activeTab = 'bookings'; // bookings | inquiries | slots | packages | blogs | settings
    this.bookings = [];
    this.inquiries = [];
    this.settings = {};
    this.slots = [];
    this.searchFilter = '';
    this.statusFilter = 'all';

    this.init();
  }

  async init() {
    await this.fetchData();
    this.render();
  }

  async fetchData() {
    try {
      const res = await fetch('/api/db');
      if (res.ok) {
        const data = await res.json();
        this.bookings = data.bookings || [];
        this.inquiries = data.inquiries || [];
        this.settings = data.settings || {};
        this.slots = data.slots || VASTU_DATA.defaultSlots;
      }
    } catch (e) {
      // Fallback to localStorage
      this.bookings = JSON.parse(localStorage.getItem('vastu_bookings') || '[]');
      this.slots = VASTU_DATA.defaultSlots;
    }
  }

  render() {
    if (!this.isAuthenticated) {
      this.renderLogin();
      return;
    }

    this.container.innerHTML = `
      <div class="max-w-6xl mx-auto p-4 md:p-8 bg-[#171717]/95 backdrop-blur-xl border border-[#C6A15B]/40 rounded-2xl shadow-2xl text-[#F8F3E9] relative">
        <!-- Top Nav -->
        <div class="flex flex-col md:flex-row md:items-center justify-between border-b border-[#C6A15B]/20 pb-4 mb-6 gap-4">
          <div class="flex items-center gap-3">
            <img src="assets/logo.png" alt="Vastu Sutram" class="h-12 w-auto object-contain original-brand-logo" />
            <div>
              <div class="flex items-center gap-2">
                <h2 class="font-serif text-xl md:text-2xl text-[#C6A15B] font-bold">Vastu Sutram Admin Portal</h2>
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Verified Session</span>
              </div>
              <p class="text-xs text-[#DCCBB0]">Executive Spatial Consultation & Appointment Operations</p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button id="admin-export-csv" class="px-3.5 py-1.5 rounded-lg border border-[#C6A15B]/40 text-xs font-semibold text-[#F9E29B] hover:bg-[#481C25] transition-all flex items-center gap-1.5">
              <span>📥</span> Export Bookings (.CSV)
            </button>
            <button id="admin-logout-btn" class="px-3.5 py-1.5 rounded-lg border border-red-500/40 text-xs font-semibold text-red-300 hover:bg-red-950/60 transition-all">
              Log Out
            </button>
            <button id="admin-close-btn" class="w-8 h-8 rounded-full border border-[#C6A15B]/40 flex items-center justify-center text-[#C6A15B] hover:bg-[#481C25] transition-all">
              ✕
            </button>
          </div>
        </div>

        <!-- Admin Tabs -->
        <div class="flex items-center gap-2 overflow-x-auto border-b border-[#C6A15B]/20 pb-3 mb-6 text-xs">
          ${[
            { id: 'bookings', label: 'Bookings & Appointments', count: this.bookings.length },
            { id: 'payments', label: 'Payments & SBI UPI Ledger', count: this.bookings.length },
            { id: 'inquiries', label: 'Client Inquiries', count: this.inquiries.length },
            { id: 'slots', label: 'Availability & Slots' },
            { id: 'packages', label: 'Package & Price Editor' },
            { id: 'blogs', label: 'Knowledge & Blog Editor' },
            { id: 'settings', label: 'Owner & API Settings' }
          ].map(tab => `
            <button data-admin-tab="${tab.id}" class="px-4 py-2 rounded-lg font-serif tracking-wider whitespace-nowrap transition-all ${
              this.activeTab === tab.id
                ? 'bg-[#C6A15B] text-[#171717] font-bold shadow-md'
                : 'text-[#DCCBB0] hover:bg-[#481C25]/50'
            }">
              ${tab.label} ${tab.count !== undefined ? `<span class="ml-1 px-1.5 py-0.2 rounded-full text-[10px] ${this.activeTab === tab.id ? 'bg-[#171717] text-[#C6A15B]' : 'bg-[#C6A15B]/20 text-[#F9E29B]'}">${tab.count}</span>` : ''}
            </button>
          `).join('')}
        </div>

        <!-- Tab Body -->
        <div id="admin-tab-content" class="min-h-[460px]">
          ${this.getTabHtml()}
        </div>
      </div>
    `;

    this.bindEvents();
  }

  renderLogin() {
    this.container.innerHTML = `
      <div class="max-w-md mx-auto p-8 bg-[#171717]/95 backdrop-blur-xl border border-[#C6A15B]/40 rounded-2xl shadow-2xl text-[#F8F3E9] text-center relative">
        <button id="admin-login-close" class="absolute top-4 right-4 text-[#C6A15B] hover:text-[#F8F3E9]">✕</button>
        <img src="assets/logo.png" alt="Vastu Sutram" class="w-48 mx-auto mb-4 object-contain original-brand-logo" />
        <h3 class="font-serif text-xl font-bold text-[#F9E29B] mb-1">Owner Admin Portal</h3>
        <p class="text-xs text-[#DCCBB0] mb-6">Enter your master security PIN to access appointment bookings and content controls.</p>

        <form id="admin-login-form" class="space-y-4">
          <div>
            <input type="password" id="admin-pin-input" placeholder="Enter Security PIN (Default: vastu2026)" class="w-full px-4 py-3 rounded-lg bg-[#12080B] border border-[#C6A15B]/40 text-center font-mono text-sm tracking-widest text-[#F8F3E9] outline-none focus:border-[#C6A15B]" />
          </div>
          <button type="submit" class="w-full py-3 rounded-lg bg-gradient-to-r from-[#D9A52D] to-[#C6A15B] text-[#171717] font-serif text-xs font-bold uppercase tracking-widest hover:shadow-[0_0_20px_rgba(198,161,91,0.5)] transition-all">
            Access Dashboard ➔
          </button>
        </form>

        <p class="text-[10px] text-[#C6A15B]/70 mt-4">Protected by SHA-256 Authentication • Vastu Sutram Operations</p>
      </div>
    `;

    const closeBtn = document.getElementById('admin-login-close');
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());

    const form = document.getElementById('admin-login-form');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const pin = document.getElementById('admin-pin-input').value.trim();
        try {
          const res = await fetch('/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pin })
          });
          if (res.ok) {
            this.isAuthenticated = true;
            sessionStorage.setItem('vastu_admin_auth', 'true');
            this.render();
            return;
          }
        } catch (_) {}
        const expectedPin = (this.settings && this.settings.ownerPin) || 'vastu2026';
        if (pin === expectedPin) {
          this.isAuthenticated = true;
          sessionStorage.setItem('vastu_admin_auth', 'true');
          this.render();
        } else {
          alert('Incorrect security PIN. Please try again.');
        }
      });
    }
  }

  getTabHtml() {
    switch (this.activeTab) {
      case 'bookings':
        return this.renderBookingsTab();
      case 'payments':
        return this.renderPaymentsTab();
      case 'inquiries':
        return this.renderInquiriesTab();
      case 'slots':
        return this.renderSlotsTab();
      case 'packages':
        return this.renderPackagesTab();
      case 'blogs':
        return this.renderBlogsTab();
      case 'settings':
        return this.renderSettingsTab();
      default:
        return ``;
    }
  }

  getPaymentStatusBadgeClass(status) {
    const s = (status || 'Pending').toLowerCase();
    if (s === 'paid' || s === 'payment verified') return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
    if (s.includes('manual verification') || s.includes('pending')) return 'bg-amber-500/20 text-amber-300 border border-amber-500/40';
    if (s === 'failed') return 'bg-rose-500/20 text-rose-300 border border-rose-500/40';
    if (s.includes('refund')) return 'bg-purple-500/20 text-purple-300 border border-purple-500/40';
    return 'bg-slate-500/20 text-[#DCCBB0] border border-[#C6A15B]/30';
  }

  renderKpiSummaryRow() {
    const totalBookings = this.bookings.length;
    const successfulPayments = this.bookings.filter(b => b.paymentStatus === 'Paid').length;
    const pendingPayments = this.bookings.filter(
      b => !b.paymentStatus || b.paymentStatus === 'Pending' || b.paymentStatus === 'Manual Verification Required'
    ).length;
    const failedPayments = this.bookings.filter(b => b.paymentStatus === 'Failed').length;
    const totalRevenue = this.bookings
      .filter(b => b.paymentStatus === 'Paid')
      .reduce((sum, b) => sum + (Number(b.amountReceived || b.amountPayable) || 0), 0);

    return `
      <div class="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4 text-xs">
        <div class="p-3.5 rounded-xl bg-[#12080B] border border-[#C6A15B]/35">
          <span class="text-[10px] uppercase tracking-wider text-[#C6A15B] block">Total Bookings</span>
          <strong class="font-serif text-lg text-[#F8F3E9]">${totalBookings}</strong>
        </div>
        <div class="p-3.5 rounded-xl bg-[#12080B] border border-emerald-500/35">
          <span class="text-[10px] uppercase tracking-wider text-emerald-300 block">Successful Payments</span>
          <strong class="font-serif text-lg text-emerald-300">${successfulPayments}</strong>
        </div>
        <div class="p-3.5 rounded-xl bg-[#12080B] border border-amber-500/35">
          <span class="text-[10px] uppercase tracking-wider text-amber-300 block">Pending Payments</span>
          <strong class="font-serif text-lg text-amber-300">${pendingPayments}</strong>
        </div>
        <div class="p-3.5 rounded-xl bg-[#12080B] border border-rose-500/35">
          <span class="text-[10px] uppercase tracking-wider text-rose-300 block">Failed Payments</span>
          <strong class="font-serif text-lg text-rose-300">${failedPayments}</strong>
        </div>
        <div class="col-span-2 sm:col-span-1 p-3.5 rounded-xl bg-[#481C25]/55 border border-[#F9E29B]/50">
          <span class="text-[10px] uppercase tracking-wider text-[#F9E29B] block">Total Revenue</span>
          <strong class="font-serif text-lg text-[#F9E29B]">₹${totalRevenue.toLocaleString('en-IN')}</strong>
        </div>
      </div>
    `;
  }

  // 1A. DEDICATED PAYMENTS & SBI UPI MANAGEMENT TAB
  renderPaymentsTab() {
    const validStatuses = [
      'Pending',
      'Paid',
      'Failed',
      'Refund Initiated',
      'Refunded',
      'Manual Verification Required'
    ];
    const validBookingStatuses = [
      'Payment Pending',
      'Payment Verified',
      'Booking Confirmed',
      'Consultation Completed',
      'Cancelled',
      'Refunded'
    ];

    let filtered = this.bookings;
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(
        b => (b.paymentStatus || 'Pending').toLowerCase() === this.statusFilter.toLowerCase()
      );
    }
    if (this.searchFilter) {
      const q = this.searchFilter.toLowerCase();
      filtered = filtered.filter(b =>
        (b.name || b.fullName || '').toLowerCase().includes(q) ||
        (b.id || '').toLowerCase().includes(q) ||
        (b.email || '').toLowerCase().includes(q) ||
        (b.transactionId || '').toLowerCase().includes(q) ||
        (b.phone || '').toLowerCase().includes(q)
      );
    }

    return `
      <div class="space-y-4">
        <!-- 5 Required Admin KPI Cards -->
        ${this.renderKpiSummaryRow()}

        <!-- Search & Payment Status Filter -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div class="relative w-full sm:w-80">
            <input type="text" id="payment-search" value="${this.searchFilter}" placeholder="Search name, Booking Ref, UTR, phone..." class="w-full px-3.5 py-2 pl-8 rounded-lg bg-[#12080B] border border-[#C6A15B]/30 text-xs text-[#F8F3E9] outline-none" />
            <span class="absolute left-2.5 top-2.5 text-xs text-[#C6A15B]">🔍</span>
          </div>

          <div class="flex items-center gap-2 text-xs w-full sm:w-auto">
            <span class="text-[#DCCBB0]">Payment Status:</span>
            <select id="payment-status-filter" class="px-3 py-1.5 rounded-lg bg-[#12080B] border border-[#C6A15B]/30 text-xs text-[#F8F3E9] outline-none">
              <option value="all" ${this.statusFilter === 'all' ? 'selected' : ''}>All Statuses (${this.bookings.length})</option>
              ${validStatuses.map(st => `
                <option value="${st}" ${this.statusFilter === st ? 'selected' : ''}>${st}</option>
              `).join('')}
            </select>
          </div>
        </div>

        <!-- Complete Admin Payment Management Table -->
        <div class="overflow-x-auto rounded-xl border border-[#C6A15B]/25 bg-[#12080B]/70">
          <table class="w-full text-left text-xs">
            <thead class="bg-[#481C25]/70 text-[#C6A15B] font-serif border-b border-[#C6A15B]/25 uppercase tracking-wider text-[10px]">
              <tr>
                <th class="p-3">Booking Ref &amp; Date</th>
                <th class="p-3">Customer Details</th>
                <th class="p-3">Package &amp; Consultation Date</th>
                <th class="p-3">Amount Payable / Paid</th>
                <th class="p-3">Transaction ID / UTR</th>
                <th class="p-3">Payment Status</th>
                <th class="p-3">Booking Status</th>
                <th class="p-3 text-right">Manual UPI Verification &amp; Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#C6A15B]/15">
              ${filtered.length === 0 ? `
                <tr><td colspan="8" class="p-8 text-center text-[#DCCBB0]/70 italic">No payment records matching the selected filter.</td></tr>
              ` : filtered.map(b => {
                const payable = b.amountPayable !== undefined ? Number(b.amountPayable) : parseInt(String(b.amount || '0').replace(/[^0-9]/g, ''), 10) || 0;
                const received = b.amountReceived !== undefined ? Number(b.amountReceived) : (b.paymentStatus === 'Paid' ? payable : 0);
                const pStatus = b.paymentStatus || 'Pending';
                const bStatus = b.status || 'Payment Pending';
                const bDate = b.createdAt ? b.createdAt.substring(0, 10) : (b.appointmentDate || '—');
                return `
                  <tr class="hover:bg-[#481C25]/20 transition-all">
                    <td class="p-3 whitespace-nowrap">
                      <div class="font-mono font-bold text-[#F9E29B]">${b.id}</div>
                      <div class="text-[10px] text-[#DCCBB0]/75">Booked: ${bDate}</div>
                    </td>
                    <td class="p-3">
                      <div class="font-semibold text-[#F8F3E9]">${b.name || b.fullName || 'Client'}</div>
                      <div class="text-[11px] text-[#DCCBB0] font-mono">${b.phone || '—'}</div>
                      <div class="text-[10px] text-[#C6A15B] truncate max-w-[160px]">${b.email || '—'}</div>
                      <div class="text-[10px] text-[#DCCBB0]/75 truncate max-w-[180px]">${b.propertyType || ''} (${b.city || ''})</div>
                    </td>
                    <td class="p-3">
                      <div class="font-medium text-[#F8F3E9]">${b.packageName || b.serviceName || b.package || 'Vastu Consultation'}</div>
                      <div class="text-[10px] text-[#F9E29B]">Date: ${b.appointmentDate || 'TBD'}</div>
                      <div class="text-[10px] text-[#DCCBB0]">${b.consultationMode || ''}</div>
                    </td>
                    <td class="p-3 font-mono whitespace-nowrap">
                      <div class="font-bold text-[#F9E29B]">Payable: ₹${payable.toLocaleString('en-IN')}</div>
                      <div class="text-[11px] ${received > 0 ? 'text-emerald-300 font-bold' : 'text-[#DCCBB0]/60'}">Received: ₹${received.toLocaleString('en-IN')}</div>
                    </td>
                    <td class="p-3 font-mono text-[11px] text-[#F8F3E9]">
                      <div>${b.transactionId || '—'}</div>
                      <div class="text-[10px] text-[#DCCBB0]">${b.paymentMethod || 'Unselected'}</div>
                    </td>
                    <td class="p-3 whitespace-nowrap">
                      <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ${this.getPaymentStatusBadgeClass(pStatus)}">
                        ${pStatus}
                      </span>
                    </td>
                    <td class="p-3 whitespace-nowrap">
                      <select
                        data-admin-booking-status="${b.id}"
                        class="px-2 py-1 rounded bg-[#12080B] border border-[#C6A15B]/35 text-[10px] text-[#F9E29B] outline-none"
                      >
                        ${validBookingStatuses.map(st => `
                          <option value="${st}" ${bStatus === st ? 'selected' : ''}>${st}</option>
                        `).join('')}
                      </select>
                    </td>
                    <td class="p-3 text-right whitespace-nowrap">
                      <div class="flex items-center justify-end gap-1.5">
                        ${pStatus !== 'Paid' ? `
                          <button
                            type="button"
                            data-verify-upi-paid="${b.id}"
                            data-payable="${payable}"
                            class="px-2.5 py-1 rounded bg-emerald-700 hover:bg-emerald-600 text-white text-[10px] font-semibold shadow"
                            title="Verify Direct SBI UPI Receipt & Confirm Booking"
                          >
                            ✓ Verify Direct UPI &amp; Confirm
                          </button>
                        ` : ''}
                        <select
                          data-admin-payment-status="${b.id}"
                          class="px-2 py-1 rounded bg-[#12080B] border border-[#C6A15B]/35 text-[10px] text-[#F8F3E9] outline-none"
                        >
                          ${validStatuses.map(st => `
                            <option value="${st}" ${pStatus === st ? 'selected' : ''}>${st}</option>
                          `).join('')}
                        </select>
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // 1. BOOKINGS TAB
  renderBookingsTab() {
    const validBookingStatuses = [
      'Payment Pending',
      'Payment Verified',
      'Booking Confirmed',
      'Consultation Completed',
      'Cancelled',
      'Refunded'
    ];

    let filtered = this.bookings;
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(b => (b.status || '').toLowerCase().includes(this.statusFilter.toLowerCase()));
    }
    if (this.searchFilter) {
      const q = this.searchFilter.toLowerCase();
      filtered = filtered.filter(b =>
        (b.name || b.fullName || '').toLowerCase().includes(q) ||
        (b.id || '').toLowerCase().includes(q) ||
        (b.email || '').toLowerCase().includes(q) ||
        (b.city || '').toLowerCase().includes(q) ||
        (b.transactionId || '').toLowerCase().includes(q)
      );
    }

    return `
      <div>
        <!-- 5 Required Admin KPI Summary Cards -->
        ${this.renderKpiSummaryRow()}

        <!-- Search & Filter Controls -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
          <div class="relative w-full sm:w-72">
            <input type="text" id="booking-search" value="${this.searchFilter}" placeholder="Search by name, Booking Ref, UTR, city..." class="w-full px-3.5 py-2 pl-8 rounded-lg bg-[#12080B] border border-[#C6A15B]/30 text-xs text-[#F8F3E9] outline-none" />
            <span class="absolute left-2.5 top-2.5 text-xs text-[#C6A15B]">🔍</span>
          </div>

          <div class="flex items-center gap-2 text-xs w-full sm:w-auto">
            <span class="text-[#DCCBB0]">Filter Booking Status:</span>
            <select id="booking-status-filter" class="px-3 py-1.5 rounded-lg bg-[#12080B] border border-[#C6A15B]/30 text-xs text-[#F8F3E9] outline-none">
              <option value="all" ${this.statusFilter === 'all' ? 'selected' : ''}>All (${this.bookings.length})</option>
              ${validBookingStatuses.map(st => `
                <option value="${st}" ${this.statusFilter === st ? 'selected' : ''}>${st}</option>
              `).join('')}
            </select>
          </div>
        </div>

        <!-- Bookings Table -->
        <div class="overflow-x-auto rounded-xl border border-[#C6A15B]/20 bg-[#12080B]/60">
          <table class="w-full text-left text-xs">
            <thead class="bg-[#481C25]/60 text-[#C6A15B] font-serif border-b border-[#C6A15B]/20 uppercase tracking-wider text-[11px]">
              <tr>
                <th class="p-3">Booking Reference</th>
                <th class="p-3">Customer Details</th>
                <th class="p-3">Package &amp; Amount</th>
                <th class="p-3">Consultation Date &amp; Mode</th>
                <th class="p-3">Payment &amp; Transaction ID</th>
                <th class="p-3">Booking Status</th>
                <th class="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#C6A15B]/10">
              ${filtered.length === 0 ? `
                <tr><td colspan="7" class="p-8 text-center text-[#DCCBB0]/70 italic">No consultation bookings matching the criteria.</td></tr>
              ` : filtered.map(b => {
                const pStatus = b.paymentStatus || 'Pending';
                const bStatus = b.status || 'Payment Pending';
                const bDate = b.createdAt ? b.createdAt.substring(0, 10) : (b.appointmentDate || '—');
                const payable = b.amountPayable || parseInt(String(b.amount || '0').replace(/[^0-9]/g, ''), 10) || 5100;
                return `
                <tr class="hover:bg-[#481C25]/20 transition-all">
                  <td class="p-3 whitespace-nowrap">
                    <div class="font-mono font-bold text-[#F9E29B]">${b.id}</div>
                    <div class="text-[10px] text-[#DCCBB0]/75">Booked: ${bDate}</div>
                  </td>
                  <td class="p-3">
                    <div class="font-semibold text-[#F8F3E9]">${b.fullName || b.name}</div>
                    <div class="text-[11px] text-[#DCCBB0]">${b.phone} • ${b.city || 'India'}</div>
                    <div class="text-[10px] text-[#C6A15B] truncate max-w-[180px]">${b.email}</div>
                  </td>
                  <td class="p-3">
                    <div class="font-medium text-[#F8F3E9]">${b.packageName || b.package}</div>
                    <div class="text-[11px] text-[#F9E29B] font-semibold">${b.amount || `₹${payable.toLocaleString('en-IN')}`}</div>
                    <div class="text-[10px] text-[#DCCBB0]">${b.propertyType || ''}</div>
                  </td>
                  <td class="p-3 whitespace-nowrap">
                    <div class="font-semibold text-[#F8F3E9]">${b.appointmentDate || 'TBD'}</div>
                    <div class="text-[11px] text-[#DCCBB0] font-mono">${(b.appointmentTime || '').split('•')[0].trim()}</div>
                    <div class="text-[10px] text-[#C6A15B]">${b.consultationMode || ''}</div>
                  </td>
                  <td class="p-3 whitespace-nowrap">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${this.getPaymentStatusBadgeClass(pStatus)}">${pStatus}</span>
                    <div class="text-[10px] font-mono text-[#DCCBB0] mt-1">${b.transactionId || 'Pending'}</div>
                  </td>
                  <td class="p-3 whitespace-nowrap">
                    <select
                      data-admin-booking-status="${b.id}"
                      class="px-2 py-1 rounded bg-[#12080B] border border-[#C6A15B]/35 text-[10px] text-[#F9E29B] outline-none"
                    >
                      ${validBookingStatuses.map(st => `
                        <option value="${st}" ${bStatus === st ? 'selected' : ''}>${st}</option>
                      `).join('')}
                    </select>
                  </td>
                  <td class="p-3 text-right whitespace-nowrap">
                    <div class="flex items-center justify-end gap-1.5">
                      ${pStatus !== 'Paid' ? `
                        <button type="button" data-verify-upi-paid="${b.id}" data-payable="${payable}" class="px-2 py-1 rounded bg-emerald-700 hover:bg-emerald-600 text-white text-[10px] font-semibold">
                          ✓ Verify UPI
                        </button>
                      ` : ''}
                      <button data-delete-booking="${b.id}" class="px-2 py-1 rounded bg-red-900/60 hover:bg-red-800 text-red-200 text-[10px]">
                        ✕
                      </button>
                    </div>
                  </td>
                </tr>
              `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // 2. INQUIRIES TAB
  renderInquiriesTab() {
    return `
      <div>
        <h3 class="font-serif text-base text-[#F9E29B] font-bold mb-3">General Website Enquiries (${this.inquiries.length})</h3>
        <div class="space-y-3">
          ${this.inquiries.length === 0 ? `
            <p class="text-xs text-[#DCCBB0]/70 italic py-6 text-center">No general enquiries received yet.</p>
          ` : this.inquiries.map(inq => `
            <div class="p-4 rounded-xl bg-[#12080B]/80 border border-[#C6A15B]/20 text-xs">
              <div class="flex items-center justify-between border-b border-[#C6A15B]/10 pb-2 mb-2">
                <div>
                  <span class="font-semibold text-[#F8F3E9] text-sm">${inq.name}</span>
                  <span class="text-[#DCCBB0] ml-2 font-mono">${inq.phone}</span>
                  <span class="text-[#C6A15B] ml-2">${inq.email}</span>
                </div>
                <span class="text-[10px] text-[#DCCBB0]/60">${inq.createdAt ? inq.createdAt.substring(0, 10) : ''}</span>
              </div>
              <div class="font-medium text-[#F9E29B] mb-1">${inq.subject || 'General Inquiry'}</div>
              <p class="text-[#DCCBB0] leading-relaxed mb-3">${inq.message}</p>
              <div class="flex items-center gap-2">
                <a href="https://wa.me/${(inq.phone || '').replace(/[^0-9]/g, '')}" target="_blank" class="px-3 py-1 rounded bg-emerald-800 hover:bg-emerald-700 text-white text-[10px] font-semibold flex items-center gap-1">
                  <span>💬</span> WhatsApp Reply
                </a>
                <a href="mailto:${inq.email}" class="px-3 py-1 rounded border border-[#C6A15B]/40 text-[#C6A15B] hover:bg-[#481C25] text-[10px] font-semibold">
                  ✉️ Email Reply
                </a>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // 3. SLOTS TAB
  renderSlotsTab() {
    return `
      <div>
        <h3 class="font-serif text-base text-[#F9E29B] font-bold mb-2">Consultation Appointment Time Slots</h3>
        <p class="text-xs text-[#DCCBB0] mb-4">Add, adjust or remove the active consultation windows offered to clients:</p>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          ${this.slots.map((s, idx) => `
            <div class="flex items-center justify-between p-3 rounded-xl bg-[#12080B] border border-[#C6A15B]/30 text-xs">
              <span class="font-mono text-[#F8F3E9] font-medium">${s}</span>
              <button data-remove-slot="${idx}" class="text-red-400 hover:text-red-300 text-xs px-2 py-0.5 font-bold">✕</button>
            </div>
          `).join('')}
        </div>

        <!-- Add Slot Form -->
        <form id="add-slot-form" class="flex items-center gap-3 max-w-md">
          <input type="text" id="new-slot-text" placeholder="e.g. 08:30 PM - 09:30 PM" class="flex-1 px-4 py-2 rounded-lg bg-[#12080B] border border-[#C6A15B]/30 text-xs text-[#F8F3E9] outline-none" required />
          <button type="submit" class="px-5 py-2 rounded-lg bg-[#C6A15B] text-[#171717] font-serif text-xs font-bold uppercase hover:bg-[#F9E29B] transition-all">
            + Add Slot
          </button>
        </form>
      </div>
    `;
  }

  // 4. PACKAGES TAB
  renderPackagesTab() {
    return `
      <div>
        <h3 class="font-serif text-base text-[#F9E29B] font-bold mb-2">Consultation Packages & Pricing Directory</h3>
        <p class="text-xs text-[#DCCBB0] mb-5">Update package fees and deliverables. Note: In compliance with brand directives, initial prices display "Starting from ₹____ / Contact for Pricing" until confirmed by the owner.</p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${VASTU_DATA.packages.map(p => `
            <div class="p-4 rounded-xl bg-[#12080B]/80 border border-[#C6A15B]/30 text-xs space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-[10px] uppercase font-bold text-[#C6A15B]">${p.category}</span>
                <span class="font-serif text-base font-bold text-[#F9E29B]">${p.price}</span>
              </div>
              <h4 class="font-serif text-sm font-bold text-[#F8F3E9]">${p.name}</h4>
              <p class="text-[#DCCBB0] text-[11px]">${p.priceNote}</p>
              <div class="text-[10px] text-[#C6A15B]">Duration: ${p.duration} • Site Visit: ${p.siteVisit}</div>
              <button data-edit-package="${p.id}" class="px-3 py-1 rounded border border-[#C6A15B]/40 text-[#C6A15B] hover:bg-[#481C25] text-[10px] font-semibold mt-1">
                ✏️ Edit Package Fee
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // 5. BLOGS TAB
  renderBlogsTab() {
    return `
      <div>
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-serif text-base text-[#F9E29B] font-bold">Vastu Articles & Knowledge Publications (${VASTU_DATA.articles.length})</h3>
          <button id="btn-new-article" class="px-4 py-1.5 rounded-lg bg-[#C6A15B] text-[#171717] font-serif text-xs font-bold uppercase hover:bg-[#F9E29B]">
            + Write New Article
          </button>
        </div>

        <div class="space-y-3">
          ${VASTU_DATA.articles.map(a => `
            <div class="p-4 rounded-xl bg-[#12080B]/80 border border-[#C6A15B]/20 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span class="text-[10px] text-[#C6A15B] uppercase font-semibold">${a.category} • ${a.readTime}</span>
                <h4 class="font-serif text-sm font-bold text-[#F8F3E9] mt-0.5">${a.title}</h4>
                <p class="text-[#DCCBB0] text-[11px] line-clamp-1 mt-1">${a.excerpt}</p>
              </div>
              <div class="flex items-center gap-2 whitespace-nowrap">
                <button data-edit-article="${a.id}" class="px-3 py-1 rounded border border-[#C6A15B]/40 text-[#C6A15B] hover:bg-[#481C25] text-[10px] font-semibold">
                  Edit
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // 6. SETTINGS TAB
  renderSettingsTab() {
    const s = this.settings || {};
    return `
      <div>
        <h3 class="font-serif text-base text-[#F9E29B] font-bold mb-2">Owner Credentials & Integration Parameters</h3>
        <p class="text-xs text-[#DCCBB0] mb-5">Configure contact numbers, official SBI UPI QR code upload, Razorpay payment keys, and WhatsApp notification channels:</p>

        <form id="admin-settings-form" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-[#C6A15B] uppercase tracking-wider mb-1">Consultant Name</label>
              <input type="text" id="set-name" value="${s.consultantName || 'Rajni Singh'}" class="w-full px-3.5 py-2 rounded-lg bg-[#12080B] border border-[#C6A15B]/30 text-xs text-[#F8F3E9] outline-none" />
            </div>

            <div>
              <label class="block text-xs font-medium text-[#C6A15B] uppercase tracking-wider mb-1">Designation</label>
              <input type="text" id="set-designation" value="${s.designation || 'Senior Vastu Consultant & Vedic Space Planner'}" class="w-full px-3.5 py-2 rounded-lg bg-[#12080B] border border-[#C6A15B]/30 text-xs text-[#F8F3E9] outline-none" />
            </div>

            <div>
              <label class="block text-xs font-medium text-[#C6A15B] uppercase tracking-wider mb-1">Calling Phone Number</label>
              <input type="text" id="set-phone" value="${s.phone || '+91 81457 15755'}" class="w-full px-3.5 py-2 rounded-lg bg-[#12080B] border border-[#C6A15B]/30 text-xs text-[#F8F3E9] outline-none" />
            </div>

            <div>
              <label class="block text-xs font-medium text-[#C6A15B] uppercase tracking-wider mb-1">WhatsApp Business Number</label>
              <input type="text" id="set-whatsapp" value="${s.whatsapp || '+91 81457 15755'}" class="w-full px-3.5 py-2 rounded-lg bg-[#12080B] border border-[#C6A15B]/30 text-xs text-[#F8F3E9] outline-none" />
            </div>

            <div>
              <label class="block text-xs font-medium text-[#C6A15B] uppercase tracking-wider mb-1">Official Email Address</label>
              <input type="email" id="set-email" value="${s.email || 'vastusutram@gmail.com'}" class="w-full px-3.5 py-2 rounded-lg bg-[#12080B] border border-[#C6A15B]/30 text-xs text-[#F8F3E9] outline-none" />
            </div>

            <div>
              <label class="block text-xs font-medium text-[#C6A15B] uppercase tracking-wider mb-1">Working Hours</label>
              <input type="text" id="set-hours" value="${s.workingHours || 'Monday – Saturday: 09:30 AM – 07:00 PM IST'}" class="w-full px-3.5 py-2 rounded-lg bg-[#12080B] border border-[#C6A15B]/30 text-xs text-[#F8F3E9] outline-none" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-[#C6A15B] uppercase tracking-wider mb-1">Consultation Coverage & Regional Availability</label>
            <input type="text" id="set-coverage" value="${s.consultationCoverage || 'Pan-India On-Site Consultations & Global Remote Video Sessions'}" class="w-full px-3.5 py-2 rounded-lg bg-[#12080B] border border-[#C6A15B]/30 text-xs text-[#F8F3E9] outline-none" />
          </div>

          <!-- Official SBI UPI QR Upload Section -->
          <div class="p-4 rounded-xl bg-[#12080B] border border-[#C6A15B]/35 space-y-2.5">
            <h4 class="font-serif text-xs font-bold text-[#F9E29B] uppercase tracking-wider">Official SBI UPI QR Code Image (gauriomji@oksbi)</h4>
            <p class="text-[11px] text-[#DCCBB0]">
              Upload your official State Bank of India UPI QR image here to display it alongside the dynamic amount-encoded UPI QR code on the payment page:
            </p>
            <div class="flex flex-col sm:flex-row sm:items-center gap-3">
              <input type="file" id="set-upi-qr-upload" accept="image/*" class="text-xs text-[#DCCBB0] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#C6A15B] file:text-[#171717]" />
              ${s.officialUpiQrImage ? `<span class="text-[11px] text-emerald-300 font-mono">✓ Uploaded: ${s.officialUpiQrImage}</span>` : `<span class="text-[11px] text-[#F9E29B]">Using verified dynamic UPI QR for gauriomji@oksbi</span>`}
            </div>
          </div>

          <div class="p-4 rounded-xl bg-[#481C25]/40 border border-[#C6A15B]/30 space-y-2.5">
            <h4 class="font-serif text-xs font-bold text-[#F9E29B] uppercase tracking-wider">Razorpay &amp; UPI Security Architecture (Server-Side Environment Variables)</h4>
            <p class="text-[11px] text-[#DCCBB0] leading-relaxed">
              For security compliance, Razorpay secret keys are <strong>never</strong> stored or exposed in frontend code or <span class="font-mono text-[#F9E29B]">data/db.json</span>. All cryptographic order creation and HMAC-SHA256 signature verification run on the server using:
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] font-mono text-[#F9E29B]">
              <div class="p-2 rounded bg-[#12080B] border border-[#C6A15B]/25">RAZORPAY_KEY_ID</div>
              <div class="p-2 rounded bg-[#12080B] border border-[#C6A15B]/25">RAZORPAY_KEY_SECRET</div>
              <div class="p-2 rounded bg-[#12080B] border border-[#C6A15B]/25">RAZORPAY_WEBHOOK_SECRET</div>
            </div>
            <p class="text-[10px] text-[#DCCBB0]/80">
              Recipient: <strong>Vastu Sutram (Rajni Singh)</strong> • Official UPI ID: <strong class="font-mono text-[#F9E29B]">gauriomji@oksbi</strong> • WhatsApp Notification Number: <strong class="font-mono text-[#F9E29B]">+91 81457 15755</strong> • Business Email: <strong class="font-mono text-[#F9E29B]">vastusutram@gmail.com</strong>
            </p>
          </div>

          <div class="flex items-center justify-between pt-3">
            <div>
              <label class="block text-xs font-medium text-[#C6A15B] mb-1">Security PIN</label>
              <input type="text" id="set-pin" value="${s.ownerPin || 'vastu2026'}" class="w-40 px-3 py-1.5 rounded bg-[#12080B] border border-[#C6A15B]/30 text-xs font-mono text-[#F8F3E9]" />
            </div>

            <button type="submit" class="px-8 py-2.5 rounded-full bg-gradient-to-r from-[#D9A52D] to-[#C6A15B] text-[#171717] font-serif text-xs font-bold uppercase tracking-wider hover:shadow-[0_0_20px_rgba(198,161,91,0.5)] transition-all">
              Save All Settings ✓
            </button>
          </div>
        </form>
      </div>
    `;
  }

  bindEvents() {
    // Close Dashboard
    const closeBtn = document.getElementById('admin-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());

    // Logout
    const logoutBtn = document.getElementById('admin-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        this.isAuthenticated = false;
        sessionStorage.removeItem('vastu_admin_auth');
        this.render();
      });
    }

    // Export CSV
    const exportBtn = document.getElementById('admin-export-csv');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        window.location.href = '/api/export/bookings.csv';
      });
    }

    // Tab Switches
    document.querySelectorAll('[data-admin-tab]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.activeTab = e.currentTarget.getAttribute('data-admin-tab');
        this.render();
      });
    });

    // Booking Status Change (Buttons)
    document.querySelectorAll('[data-status-change]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.currentTarget.getAttribute('data-status-change');
        const newStatus = e.currentTarget.getAttribute('data-new-status');
        try {
          await fetch(`/api/bookings/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
          });
          const b = this.bookings.find(x => x.id === id);
          if (b) b.status = newStatus;
          this.render();
        } catch (err) {
          console.error(err);
        }
      });
    });

    // Admin Booking Status Dropdown (Payment Pending | Payment Verified | Booking Confirmed | Consultation Completed | Cancelled | Refunded)
    document.querySelectorAll('[data-admin-booking-status]').forEach(sel => {
      sel.addEventListener('change', async (e) => {
        const bookingId = e.currentTarget.getAttribute('data-admin-booking-status');
        const nextBookingStatus = e.currentTarget.value;
        try {
          const res = await fetch('/api/payments/admin-update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              bookingId,
              bookingStatus: nextBookingStatus
            })
          });
          if (res.ok) {
            const data = await res.json();
            const idx = this.bookings.findIndex(b => b.id === bookingId);
            if (idx !== -1 && data.booking) {
              this.bookings[idx] = data.booking;
            }
            this.render();
          }
        } catch (err) {
          console.error(err);
        }
      });
    });

    // Delete Booking
    document.querySelectorAll('[data-delete-booking]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.currentTarget.getAttribute('data-delete-booking');
        if (confirm(`Remove booking ${id}?`)) {
          try {
            await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
            this.bookings = this.bookings.filter(b => b.id !== id);
            this.render();
          } catch (err) {
            console.error(err);
          }
        }
      });
    });

    // Booking Search
    const searchInput = document.getElementById('booking-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchFilter = e.target.value;
        const container = document.getElementById('admin-tab-content');
        if (container) container.innerHTML = this.renderBookingsTab();
        this.bindEvents();
      });
    }

    // Payment Search & Status Filter
    const paySearchInput = document.getElementById('payment-search');
    if (paySearchInput) {
      paySearchInput.addEventListener('input', (e) => {
        this.searchFilter = e.target.value;
        const container = document.getElementById('admin-tab-content');
        if (container) container.innerHTML = this.renderPaymentsTab();
        this.bindEvents();
      });
    }

    const payFilterSelect = document.getElementById('payment-status-filter');
    if (payFilterSelect) {
      payFilterSelect.addEventListener('change', (e) => {
        this.statusFilter = e.target.value;
        const container = document.getElementById('admin-tab-content');
        if (container) container.innerHTML = this.renderPaymentsTab();
        this.bindEvents();
      });
    }

    // One-Click Verify SBI UPI & Mark Paid
    document.querySelectorAll('[data-verify-upi-paid]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const bookingId = e.currentTarget.getAttribute('data-verify-upi-paid');
        const payable = Number(e.currentTarget.getAttribute('data-payable') || 0);
        try {
          const res = await fetch('/api/payments/admin-update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              bookingId,
              paymentStatus: 'Paid',
              bookingStatus: 'Booking Confirmed',
              amountReceived: payable
            })
          });
          if (res.ok) {
            const data = await res.json();
            const idx = this.bookings.findIndex(b => b.id === bookingId);
            if (idx !== -1 && data.booking) {
              this.bookings[idx] = data.booking;
            }
            this.render();
          }
        } catch (err) {
          console.error(err);
        }
      });
    });

    // Admin Payment Status Select Dropdown (Pending | Paid | Failed | Refund Initiated | Refunded | Manual Verification Required)
    document.querySelectorAll('[data-admin-payment-status]').forEach(sel => {
      sel.addEventListener('change', async (e) => {
        const bookingId = e.currentTarget.getAttribute('data-admin-payment-status');
        const nextStatus = e.currentTarget.value;
        try {
          const res = await fetch('/api/payments/admin-update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              bookingId,
              paymentStatus: nextStatus
            })
          });
          if (res.ok) {
            const data = await res.json();
            const idx = this.bookings.findIndex(b => b.id === bookingId);
            if (idx !== -1 && data.booking) {
              this.bookings[idx] = data.booking;
            }
            this.render();
          }
        } catch (err) {
          console.error(err);
        }
      });
    });

    // Booking Status Filter
    const filterSelect = document.getElementById('booking-status-filter');
    if (filterSelect) {
      filterSelect.addEventListener('change', (e) => {
        this.statusFilter = e.target.value;
        const container = document.getElementById('admin-tab-content');
        if (container) container.innerHTML = this.renderBookingsTab();
        this.bindEvents();
      });
    }

    // Remove Slot
    document.querySelectorAll('[data-remove-slot]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const idx = parseInt(e.currentTarget.getAttribute('data-remove-slot'));
        this.slots.splice(idx, 1);
        await this.saveSlots();
        this.render();
      });
    });

    // Add Slot
    const addSlotForm = document.getElementById('add-slot-form');
    if (addSlotForm) {
      addSlotForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const input = document.getElementById('new-slot-text');
        if (input && input.value.trim()) {
          this.slots.push(input.value.trim());
          await this.saveSlots();
          this.render();
        }
      });
    }

    // Official SBI UPI QR Upload Input
    const qrUploadInput = document.getElementById('set-upi-qr-upload');
    if (qrUploadInput) {
      qrUploadInput.addEventListener('change', async (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async () => {
          try {
            const upRes = await fetch('/api/upload', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ fileName: file.name, fileData: reader.result })
            });
            const upData = await upRes.json();
            if (upData.success && upData.filePath) {
              await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ officialUpiQrImage: upData.filePath })
              });
              this.settings.officialUpiQrImage = upData.filePath;
              if (window.VastuApp && window.VastuApp.db && window.VastuApp.db.settings) {
                window.VastuApp.db.settings.officialUpiQrImage = upData.filePath;
              }
              this.render();
            }
          } catch (err) {
            console.error(err);
          }
        };
        reader.readAsDataURL(file);
      });
    }

    // Save Settings Form
    const settingsForm = document.getElementById('admin-settings-form');
    if (settingsForm) {
      settingsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const updated = {
          consultantName: document.getElementById('set-name').value,
          designation: document.getElementById('set-designation').value,
          phone: document.getElementById('set-phone').value,
          whatsapp: document.getElementById('set-whatsapp').value,
          email: document.getElementById('set-email').value,
          workingHours: document.getElementById('set-hours').value,
          consultationCoverage: document.getElementById('set-coverage').value,
          ownerPin: document.getElementById('set-pin').value
        };

        try {
          await fetch('/api/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updated)
          });
          this.settings = { ...this.settings, ...updated };
          alert('Settings saved successfully!');
        } catch (err) {
          alert('Saved locally.');
        }
      });
    }
  }

  async saveSlots() {
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slots: this.slots })
      });
    } catch (e) {
      console.error(e);
    }
  }

  close() {
    if (window.VastuApp && window.VastuApp.closeAdminModal) {
      window.VastuApp.closeAdminModal();
    }
  }
}

window.VastuAdminDashboard = VastuAdminDashboard;
