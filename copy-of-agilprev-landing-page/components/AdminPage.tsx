import React, { useCallback, useEffect, useMemo, useState } from 'react';

const API_URL =
  import.meta.env.VITE_API_URL || 'https://agilprev-production.up.railway.app';

const ADMIN_SESSION_KEY = 'agilprev_admin_auth';
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD as string | undefined;

interface Lead {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  produto: string;
  tipo_beneficio: string;
  problema_principal: string;
  origem: string;
  status_funil: string;
  status_pagamento: string;
  valor_centavos: number;
  created_at: string;
  updated_at: string;
}

interface DashboardStats {
  totalSessions: number;
  totalPayments: number;
  revenueCents: number;
  revenueFormatted: string;
}

interface DashboardData {
  stats: DashboardStats;
  leads: Lead[];
}

type LoadState = 'idle' | 'loading' | 'success' | 'error';

function normalizeDashboard(raw: Record<string, unknown>): DashboardData {
  const statsBlock = (raw.stats as Record<string, unknown>) || raw;

  const totalSessions = Number(
    statsBlock.totalSessions ?? raw.totalSessions ?? 0
  );
  const totalPayments = Number(
    statsBlock.totalPayments ?? raw.totalPaid ?? raw.totalPayments ?? 0
  );
  const revenueCents = Number(
    statsBlock.revenueCents ?? raw.revenueCents ?? 0
  );
  const revenueFormatted =
    (statsBlock.revenueFormatted as string) ||
    (raw.revenueFormatted as string) ||
    (revenueCents / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

  const leads = Array.isArray(raw.leads) ? (raw.leads as Lead[]) : [];

  return {
    stats: { totalSessions, totalPayments, revenueCents, revenueFormatted },
    leads,
  };
}

function formatDate(iso: string | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatMoney(centavos: number): string {
  return (centavos / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function conversionRate(sessions: number, paid: number): string {
  if (sessions === 0) return '0%';
  return `${((paid / sessions) * 100).toFixed(1)}%`;
}

function isPaid(status: string): boolean {
  const s = status.toLowerCase();
  return s === 'paid' || s === 'completed' || s === 'pago' || s === 'aprovado';
}

function funnelBadgeClass(status: string): string {
  const s = status.toLowerCase();
  if (s.includes('pago') || s.includes('conclu') || s.includes('done'))
    return 'bg-emerald-100 text-emerald-800';
  if (s.includes('preview') || s.includes('gerando') || s.includes('chat'))
    return 'bg-blue-100 text-blue-800';
  if (s.includes('abandon') || s.includes('cancel'))
    return 'bg-red-100 text-red-800';
  return 'bg-slate-100 text-slate-700';
}

function paymentBadgeClass(status: string): string {
  if (isPaid(status)) return 'bg-emerald-100 text-emerald-800';
  if (status === 'sem_pagamento' || !status)
    return 'bg-slate-100 text-slate-600';
  if (
    status.toLowerCase().includes('pend') ||
    status.toLowerCase().includes('wait')
  )
    return 'bg-amber-100 text-amber-800';
  return 'bg-slate-100 text-slate-700';
}

function formatStatusLabel(status: string): string {
  if (!status || status === 'sem_pagamento') return 'Sem pagamento';
  return status.replace(/_/g, ' ');
}

function StatusBadge({ label, className }: { label: string; className: string }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${className}`}
    >
      {formatStatusLabel(label)}
    </span>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  accent,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  accent: 'green' | 'blue' | 'lime' | 'slate';
}) {
  const accentMap = {
    green: 'border-l-emerald-500',
    blue: 'border-l-agil-blue',
    lime: 'border-l-lime-500',
    slate: 'border-l-slate-400',
  };

  return (
    <div
      className={`rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm border-l-4 ${accentMap[accent]}`}
    >
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
        {value}
      </p>
      {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
    </div>
  );
}

function AdminLogin({
  onSuccess,
  error,
}: {
  onSuccess: (password: string) => void;
  error: string | null;
}) {
  const [password, setPassword] = useState('');

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-slate-900">
          <span className="text-logo-green">Agil</span>
          <span className="text-logo-blue">prev</span>
          <span className="text-slate-600"> — Admin</span>
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Informe a senha de acesso ao painel.
        </p>
        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            onSuccess(password);
          }}
        >
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            autoComplete="current-password"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-agil-blue focus:ring-2 focus:ring-agil-blue/20"
          />
          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="w-full rounded-xl bg-agil-blue py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-7xl animate-pulse space-y-8">
        <div className="h-10 w-64 rounded-lg bg-slate-200" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-white shadow-sm" />
          ))}
        </div>
        <div className="h-96 rounded-2xl bg-white shadow-sm" />
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(() => {
    if (!ADMIN_PASSWORD) return true;
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === '1';
  });
  const [loginError, setLoginError] = useState<string | null>(null);

  const [data, setData] = useState<DashboardData | null>(null);
  const [loadState, setLoadState] = useState<LoadState>('idle');
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const [search, setSearch] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'paid' | 'unpaid'>(
    'all'
  );

  const fetchDashboard = useCallback(async () => {
    setLoadState('loading');
    setFetchError(null);
    try {
      const res = await fetch(`${API_URL}/api/admin/dashboard`);
      const json = await res.json();
      if (!res.ok || json.success === false) {
        throw new Error(json.error || `Erro HTTP ${res.status}`);
      }
      setData(normalizeDashboard(json));
      setLastUpdated(new Date());
      setLoadState('success');
    } catch (err) {
      setFetchError(
        err instanceof Error ? err.message : 'Falha ao carregar o painel'
      );
      setLoadState('error');
    }
  }, []);

  useEffect(() => {
    if (authenticated) fetchDashboard();
  }, [authenticated, fetchDashboard]);

  const handleLogin = (password: string) => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, '1');
      setAuthenticated(true);
      setLoginError(null);
    } else {
      setLoginError('Senha incorreta.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setAuthenticated(false);
    setData(null);
    setLoadState('idle');
  };

  const filteredLeads = useMemo(() => {
    if (!data) return [];
    const q = search.trim().toLowerCase();
    return data.leads.filter((lead) => {
      if (paymentFilter === 'paid' && !isPaid(lead.status_pagamento))
        return false;
      if (
        paymentFilter === 'unpaid' &&
        (isPaid(lead.status_pagamento) || lead.status_pagamento === 'sem_pagamento')
      )
        return false;
      if (!q) return true;
      const haystack = [
        lead.nome,
        lead.email,
        lead.telefone,
        lead.produto,
        lead.tipo_beneficio,
        lead.status_funil,
        lead.status_pagamento,
        lead.origem,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [data, search, paymentFilter]);

  const paidLeadsCount = useMemo(
    () => data?.leads.filter((l) => isPaid(l.status_pagamento)).length ?? 0,
    [data]
  );

  if (!authenticated) {
    return <AdminLogin onSuccess={handleLogin} error={loginError} />;
  }

  if (loadState === 'loading' && !data) {
    return <LoadingSkeleton />;
  }

  if (loadState === 'error' && !data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 px-4">
        <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
          <p className="text-lg font-semibold text-slate-900">
            Não foi possível carregar o painel
          </p>
          <p className="mt-2 text-sm text-slate-500">{fetchError}</p>
          <button
            type="button"
            onClick={fetchDashboard}
            className="mt-6 rounded-xl bg-agil-blue px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { stats } = data;

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              <span className="text-logo-green">Agil</span>
              <span className="text-logo-blue">prev</span>
              <span className="font-normal text-slate-500"> — Painel</span>
            </h1>
            {lastUpdated && (
              <p className="mt-1 text-xs text-slate-400">
                Atualizado em {formatDate(lastUpdated.toISOString())}
              </p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={fetchDashboard}
              disabled={loadState === 'loading'}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              {loadState === 'loading' ? 'Atualizando…' : 'Atualizar'}
            </button>
            {ADMIN_PASSWORD && (
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Sair
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-8">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Leads (sessões)"
            value={stats.totalSessions}
            subtitle="Total de interações no funil"
            accent="blue"
          />
          <StatCard
            title="Pagamentos confirmados"
            value={stats.totalPayments}
            subtitle={`${paidLeadsCount} na lista atual`}
            accent="green"
          />
          <StatCard
            title="Taxa de conversão"
            value={conversionRate(stats.totalSessions, stats.totalPayments)}
            subtitle="Pagamentos ÷ leads"
            accent="lime"
          />
          <StatCard
            title="Faturamento"
            value={stats.revenueFormatted}
            subtitle="Receita confirmada"
            accent="slate"
          />
        </section>

        <section className="rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Leads</h2>
              <p className="text-sm text-slate-500">
                {filteredLeads.length} de {data.leads.length} registros
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                type="search"
                placeholder="Buscar nome, e-mail, produto…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-agil-blue focus:ring-2 focus:ring-agil-blue/20 sm:w-64"
              />
              <select
                value={paymentFilter}
                onChange={(e) =>
                  setPaymentFilter(e.target.value as 'all' | 'paid' | 'unpaid')
                }
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-agil-blue"
              >
                <option value="all">Todos os pagamentos</option>
                <option value="paid">Somente pagos</option>
                <option value="unpaid">Não pagos / pendentes</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-6 py-3">Contato</th>
                  <th className="px-4 py-3">Produto</th>
                  <th className="px-4 py-3">Benefício</th>
                  <th className="px-4 py-3">Funil</th>
                  <th className="px-4 py-3">Pagamento</th>
                  <th className="px-4 py-3">Valor</th>
                  <th className="px-4 py-3">Origem</th>
                  <th className="px-6 py-3">Atualizado</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-12 text-center text-slate-400"
                    >
                      Nenhum lead encontrado com os filtros atuais.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="border-b border-slate-50 transition hover:bg-slate-50/50"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900">
                          {lead.nome || '—'}
                        </p>
                        <p className="text-xs text-slate-500">
                          {lead.email || '—'}
                        </p>
                        {lead.telefone && (
                          <p className="text-xs text-slate-400">
                            {lead.telefone}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-4 text-slate-700">
                        {lead.produto || '—'}
                      </td>
                      <td className="max-w-[140px] truncate px-4 py-4 text-slate-600">
                        {lead.tipo_beneficio || '—'}
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge
                          label={lead.status_funil || '—'}
                          className={funnelBadgeClass(lead.status_funil)}
                        />
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge
                          label={lead.status_pagamento}
                          className={paymentBadgeClass(lead.status_pagamento)}
                        />
                      </td>
                      <td className="px-4 py-4 font-medium text-slate-800">
                        {lead.valor_centavos > 0
                          ? formatMoney(lead.valor_centavos)
                          : '—'}
                      </td>
                      <td className="px-4 py-4 capitalize text-slate-500">
                        {lead.origem || '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                        {formatDate(lead.updated_at || lead.created_at)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {fetchError && loadState === 'success' && (
          <p className="text-center text-sm text-amber-600" role="status">
            Última atualização falhou: {fetchError}. Exibindo dados em cache.
          </p>
        )}
      </main>
    </div>
  );
}
