import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const API_URL = 'https://agilprev-production.up.railway.app';
const ADMIN_SESSION_KEY = 'agilprev_admin_auth';

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
type PaymentFilter = 'all' | 'paid' | 'pending' | 'sem_pagamento';
type ProductFilter = 'all' | 'documento' | 'premium';
type BenefitFilter =
  | 'all'
  | 'aposentadoria'
  | 'auxilio-doenca'
  | 'pensao'
  | 'maternidade'
  | 'bpc-loas'
  | 'revisao'
  | 'outro';

function getStoredToken(): string | null {
  const raw = localStorage.getItem(ADMIN_SESSION_KEY);
  return raw && raw.trim() ? raw.trim() : null;
}

function displayNome(nome: string): string {
  return nome?.trim() ? nome.trim() : 'Lead sem nome';
}

function displayTelefone(telefone: string): string {
  return telefone?.trim() ? telefone.trim() : 'Telefone não informado';
}

function displayBeneficio(beneficio: string): string {
  return beneficio?.trim() ? beneficio.trim() : 'Não identificado';
}

function displayProblema(problema: string): string {
  return problema?.trim() ? problema.trim() : 'Ainda não identificado';
}

function displayOptional(value: string): string {
  return value?.trim() ? value.trim() : '—';
}

function hasTelefone(telefone: string): boolean {
  const digits = telefone?.replace(/\D/g, '') ?? '';
  return digits.length >= 10;
}

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

function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function isPaid(status: string): boolean {
  const s = norm(status);
  return (
    s === 'paid' ||
    s === 'completed' ||
    s === 'pago' ||
    s === 'aprovado' ||
    s.includes('confirmad')
  );
}

function isPendingPayment(status: string): boolean {
  if (!status || isPaid(status)) return false;
  const s = norm(status);
  if (s === 'sem_pagamento' || s === 'sem pagamento') return false;
  return (
    s.includes('pend') ||
    s.includes('wait') ||
    s.includes('aguard') ||
    s.includes('process')
  );
}

function isSemPagamento(status: string): boolean {
  if (!status) return true;
  const s = norm(status);
  return s === 'sem_pagamento' || s === 'sem pagamento';
}

function isPremiumProduct(produto: string): boolean {
  return norm(produto).includes('premium');
}

function isDocumentoProduct(produto: string): boolean {
  const p = norm(produto);
  return p.includes('documento') || p.includes('produto 1') || p === 'documento';
}

function matchesProductFilter(produto: string, filter: ProductFilter): boolean {
  if (filter === 'all') return true;
  if (filter === 'premium') return isPremiumProduct(produto);
  return isDocumentoProduct(produto);
}

function matchesBenefitFilter(
  beneficio: string,
  filter: BenefitFilter
): boolean {
  if (filter === 'all') return true;
  const b = norm(beneficio);
  if (!b) return filter === 'outro';

  const rules: Record<Exclude<BenefitFilter, 'all'>, string[]> = {
    aposentadoria: ['aposentadoria', 'aposent'],
    'auxilio-doenca': ['auxilio', 'doenca', 'incapacidade', 'invalidez'],
    pensao: ['pensao', 'pensão'],
    maternidade: ['maternidade', 'salario-maternidade', 'salario maternidade'],
    'bpc-loas': ['bpc', 'loas', 'beneficio de prestacao continuada'],
    revisao: ['revisao', 'revisão'],
    outro: [],
  };

  if (filter === 'outro') {
    const known = Object.entries(rules)
      .filter(([k]) => k !== 'outro')
      .flatMap(([, keys]) => keys);
    return !known.some((k) => b.includes(norm(k)));
  }

  return rules[filter].some((k) => b.includes(norm(k)));
}

function matchesPaymentFilter(
  status: string,
  filter: PaymentFilter
): boolean {
  if (filter === 'all') return true;
  if (filter === 'paid') return isPaid(status);
  if (filter === 'pending') return isPendingPayment(status);
  return isSemPagamento(status);
}

function funnelBadgeClass(status: string): string {
  const s = norm(status);
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
  if (isSemPagamento(status)) return 'bg-slate-100 text-slate-600';
  if (isPendingPayment(status)) return 'bg-amber-100 text-amber-800';
  return 'bg-slate-100 text-slate-700';
}

function formatPaymentStatusLabel(status: string): string {
  if (!status || isSemPagamento(status)) return 'Sem pagamento';
  const s = norm(status);
  if (s === 'paid' || isPaid(status)) return 'Pago';
  if (s === 'pending') return 'Pendente';
  return status.replace(/_/g, ' ');
}

function formatFunnelStatusLabel(status: string): string {
  if (!status || status === '—') return '—';
  return status.replace(/_/g, ' ');
}

function benefitBadgeClass(beneficio: string): string {
  if (!beneficio?.trim()) return 'bg-slate-100 text-slate-500';

  const colorByKind: Record<Exclude<BenefitFilter, 'all'>, string> = {
    aposentadoria: 'bg-blue-100 text-blue-800',
    'auxilio-doenca': 'bg-amber-100 text-amber-800',
    pensao: 'bg-purple-100 text-purple-800',
    maternidade: 'bg-pink-100 text-pink-800',
    'bpc-loas': 'bg-teal-100 text-teal-800',
    revisao: 'bg-indigo-100 text-indigo-800',
    outro: 'bg-slate-100 text-slate-700',
  };

  const kinds: Exclude<BenefitFilter, 'all'>[] = [
    'aposentadoria',
    'auxilio-doenca',
    'pensao',
    'maternidade',
    'bpc-loas',
    'revisao',
  ];

  const kind =
    kinds.find((k) => matchesBenefitFilter(beneficio, k)) ?? 'outro';
  return colorByKind[kind];
}

function whatsAppUrl(telefone: string): string {
  const digits = telefone.replace(/\D/g, '');
  const withCountry = digits.startsWith('55') ? digits : `55${digits}`;
  return `https://wa.me/${withCountry}`;
}

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function StatusBadge({
  label,
  className,
  variant = 'funnel',
}: {
  label: string;
  className: string;
  variant?: 'funnel' | 'payment';
}) {
  const text =
    variant === 'payment'
      ? formatPaymentStatusLabel(label)
      : formatFunnelStatusLabel(label);

  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${className}`}
    >
      {text}
    </span>
  );
}

function BenefitBadge({ beneficio }: { beneficio: string }) {
  const label = displayBeneficio(beneficio);

  return (
    <span
      className={`inline-block max-w-[160px] truncate rounded-full px-2.5 py-0.5 text-xs font-semibold ${benefitBadgeClass(beneficio)}`}
      title={label}
    >
      {label}
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
  accent: 'blue' | 'green' | 'lime' | 'slate' | 'amber' | 'violet';
}) {
  const accentMap: Record<string, string> = {
    blue: 'border-l-[#1e3a5f]',
    green: 'border-l-emerald-500',
    lime: 'border-l-lime-500',
    slate: 'border-l-slate-400',
    amber: 'border-l-amber-500',
    violet: 'border-l-violet-500',
  };

  return (
    <div
      className={`rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm border-l-4 ${accentMap[accent]}`}
    >
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-bold tracking-tight text-[#1e3a5f] sm:text-3xl">
        {value}
      </p>
      {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
    </div>
  );
}

function AdminLogin({
  onLogin,
  error,
  loading,
}: {
  onLogin: (password: string) => void;
  error: string | null;
  loading: boolean;
}) {
  const [password, setPassword] = useState('');

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#1e3a5f] via-[#1e3a5f] to-[#0f2744] px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white p-8 shadow-2xl">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-bold text-[#1e3a5f]">
            Acesso Restrito{' '}
            <span className="text-logo-green">Agil</span>
            <span className="text-logo-blue">prev</span>
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Área exclusiva para parceiros e equipe interna.
          </p>
        </div>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            onLogin(password);
          }}
        >
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              Senha de acesso
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              autoComplete="current-password"
              disabled={loading}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20 disabled:opacity-60"
            />
          </label>
          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#1e3a5f] py-3 text-sm font-semibold text-white transition hover:bg-[#162d4a] disabled:opacity-60"
          >
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-[#1e3a5f]" />
      <p className="mt-4 text-sm font-medium text-slate-600">
        Carregando painel administrativo…
      </p>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </dt>
      <dd className="mt-1 break-words text-sm text-slate-800">{value}</dd>
    </div>
  );
}

function LeadDetailPanel({
  lead,
  onClose,
}: {
  lead: Lead;
  onClose: () => void;
}) {
  const [copyHint, setCopyHint] = useState<string | null>(null);
  const phoneOk = hasTelefone(lead.telefone);

  const handleCopy = async (label: string, text: string) => {
    const ok = await copyToClipboard(text);
    setCopyHint(ok ? `${label} copiado` : `Não foi possível copiar ${label}`);
    setTimeout(() => setCopyHint(null), 2000);
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40"
        onClick={onClose}
        aria-hidden
      />
      <aside
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl"
        role="dialog"
        aria-labelledby="lead-detail-title"
      >
        <div className="flex items-center justify-between border-b border-slate-100 bg-[#1e3a5f] px-6 py-4 text-white">
          <h2 id="lead-detail-title" className="text-lg font-bold">
            Detalhes do lead
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <dl className="space-y-5">
            <DetailRow label="ID da sessão" value={lead.id} />
            <DetailRow label="Nome" value={displayNome(lead.nome)} />
            <DetailRow label="E-mail" value={displayOptional(lead.email)} />
            <DetailRow label="Telefone" value={displayTelefone(lead.telefone)} />
            <DetailRow label="Produto" value={displayOptional(lead.produto)} />
            <DetailRow
              label="Tipo de benefício"
              value={displayBeneficio(lead.tipo_beneficio)}
            />
            <DetailRow
              label="Problema principal"
              value={displayProblema(lead.problema_principal)}
            />
            <DetailRow label="Origem" value={displayOptional(lead.origem)} />
            <DetailRow
              label="Status do funil"
              value={displayOptional(lead.status_funil)}
            />
            <DetailRow
              label="Status do pagamento"
              value={formatPaymentStatusLabel(lead.status_pagamento)}
            />
            <DetailRow
              label="Valor"
              value={
                lead.valor_centavos > 0
                  ? formatMoney(lead.valor_centavos)
                  : '—'
              }
            />
            <DetailRow
              label="Data de criação"
              value={formatDate(lead.created_at)}
            />
            <DetailRow
              label="Última atualização"
              value={formatDate(lead.updated_at)}
            />
          </dl>

          {copyHint && (
            <p className="mt-4 text-center text-xs font-medium text-emerald-700">
              {copyHint}
            </p>
          )}

          <div className="mt-8 space-y-2">
            <button
              type="button"
              onClick={() => handleCopy('ID', lead.id)}
              className="w-full rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-[#1e3a5f] hover:bg-slate-50"
            >
              Copiar ID
            </button>
            {phoneOk && (
              <>
                <button
                  type="button"
                  onClick={() => handleCopy('telefone', lead.telefone.trim())}
                  className="w-full rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-[#1e3a5f] hover:bg-slate-50"
                >
                  Copiar telefone
                </button>
                <a
                  href={whatsAppUrl(lead.telefone)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  Abrir WhatsApp
                </a>
              </>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl bg-[#1e3a5f] py-2.5 text-sm font-semibold text-white transition hover:bg-[#162d4a]"
            >
              Fechar
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(
    () => !!getStoredToken()
  );
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  const [data, setData] = useState<DashboardData | null>(null);
  const [loadState, setLoadState] = useState<LoadState>('idle');
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const [search, setSearch] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>('all');
  const [productFilter, setProductFilter] = useState<ProductFilter>('all');
  const [benefitFilter, setBenefitFilter] = useState<BenefitFilter>('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const dataRef = useRef<DashboardData | null>(null);
  dataRef.current = data;

  const clearSession = useCallback(() => {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    setAuthenticated(false);
    setData(null);
    setLoadState('idle');
    setSelectedLead(null);
  }, []);

  const fetchDashboard = useCallback(async () => {
    const token = getStoredToken();
    if (!token) {
      clearSession();
      return;
    }

    setLoadState('loading');
    setFetchError(null);
    try {
      const res = await fetch(`${API_URL}/api/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();

      if (res.status === 401) {
        clearSession();
        setFetchError('Sessão expirada. Faça login novamente.');
        return;
      }

      if (!res.ok || json.success === false) {
        throw new Error(json.error || `Erro HTTP ${res.status}`);
      }

      setData(normalizeDashboard(json));
      setLastUpdated(new Date());
      setLoadState('success');
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Não foi possível carregar os dados. Tente novamente.';
      setFetchError(message);
      setLoadState(dataRef.current ? 'success' : 'error');
    }
  }, [clearSession]);

  useEffect(() => {
    if (authenticated) fetchDashboard();
  }, [authenticated, fetchDashboard]);

  const handleLogin = async (password: string) => {
    setLoginLoading(true);
    setLoginError(null);
    try {
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const json = await res.json();

      if (!res.ok || !json.success || !json.token) {
        setLoginError('Senha incorreta');
        return;
      }

      localStorage.setItem(ADMIN_SESSION_KEY, json.token);
      setAuthenticated(true);
    } catch {
      setLoginError('Não foi possível autenticar. Tente novamente.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    clearSession();
  };

  const derivedMetrics = useMemo(() => {
    if (!data) {
      return { pendingLeads: 0, premiumSold: 0 };
    }
    const pendingLeads = data.leads.filter(
      (l) => !isPaid(l.status_pagamento)
    ).length;
    const premiumSold = data.leads.filter(
      (l) => isPremiumProduct(l.produto) && isPaid(l.status_pagamento)
    ).length;
    return { pendingLeads, premiumSold };
  }, [data]);

  const filteredLeads = useMemo(() => {
    if (!data) return [];
    const q = search.trim().toLowerCase();
    return data.leads.filter((lead) => {
      if (!matchesPaymentFilter(lead.status_pagamento, paymentFilter))
        return false;
      if (!matchesProductFilter(lead.produto, productFilter)) return false;
      if (!matchesBenefitFilter(lead.tipo_beneficio, benefitFilter))
        return false;
      if (!q) return true;
      const haystack = [
        lead.nome,
        lead.email,
        lead.telefone,
        lead.produto,
        lead.tipo_beneficio,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [data, search, paymentFilter, productFilter, benefitFilter]);

  if (!authenticated) {
    return (
      <AdminLogin
        onLogin={handleLogin}
        error={loginError}
        loading={loginLoading}
      />
    );
  }

  if (loadState === 'loading' && !data) {
    return <LoadingScreen />;
  }

  if (loadState === 'error' && !data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-lg">
          <p className="text-lg font-semibold text-[#1e3a5f]">
            Não foi possível carregar o painel
          </p>
          <p className="mt-2 text-sm text-slate-500">{fetchError}</p>
          <button
            type="button"
            onClick={fetchDashboard}
            className="mt-6 rounded-xl bg-[#1e3a5f] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#162d4a]"
          >
            Tentar novamente
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-3 block w-full text-sm text-slate-500 hover:text-slate-700"
          >
            Sair
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { stats } = data;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-[#1e3a5f] sm:text-2xl">
                <span className="text-logo-green">Agil</span>
                <span className="text-logo-blue">prev</span>
                <span className="text-[#1e3a5f]"> — Painel Administrativo</span>
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Gestão de leads, pagamentos e conversões
              </p>
              {lastUpdated && (
                <p className="mt-1 text-xs text-slate-400">
                  Atualizado em {formatDate(lastUpdated.toISOString())}
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={fetchDashboard}
                disabled={loadState === 'loading'}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-[#1e3a5f] transition hover:bg-slate-50 disabled:opacity-50"
              >
                {loadState === 'loading' ? 'Atualizando…' : 'Atualizar'}
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl bg-[#1e3a5f] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#162d4a]"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-8">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <StatCard
            title="Leads totais"
            value={stats.totalSessions}
            subtitle="Sessões no funil"
            accent="blue"
          />
          <StatCard
            title="Pagamentos confirmados"
            value={stats.totalPayments}
            subtitle="Transações aprovadas"
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
          <StatCard
            title="Leads pendentes"
            value={derivedMetrics.pendingLeads}
            subtitle="Sem pagamento confirmado"
            accent="amber"
          />
          <StatCard
            title="Premium vendidos"
            value={derivedMetrics.premiumSold}
            subtitle="Premium com pagamento"
            accent="violet"
          />
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-6">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-[#1e3a5f]">Leads</h2>
              <p className="text-sm text-slate-500">
                {filteredLeads.length} de {data.leads.length} registros
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <input
                type="search"
                placeholder="Buscar nome, e-mail, telefone, produto, benefício…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20"
              />
              <select
                value={paymentFilter}
                onChange={(e) =>
                  setPaymentFilter(e.target.value as PaymentFilter)
                }
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-[#1e3a5f]"
              >
                <option value="all">Pagamento: todos</option>
                <option value="paid">Pagamento: paid</option>
                <option value="pending">Pagamento: pending</option>
                <option value="sem_pagamento">Pagamento: sem_pagamento</option>
              </select>
              <select
                value={productFilter}
                onChange={(e) =>
                  setProductFilter(e.target.value as ProductFilter)
                }
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-[#1e3a5f]"
              >
                <option value="all">Produto: todos</option>
                <option value="documento">Produto: documento</option>
                <option value="premium">Produto: premium</option>
              </select>
              <select
                value={benefitFilter}
                onChange={(e) =>
                  setBenefitFilter(e.target.value as BenefitFilter)
                }
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-[#1e3a5f]"
              >
                <option value="all">Benefício: todos</option>
                <option value="aposentadoria">Aposentadoria</option>
                <option value="auxilio-doenca">Auxílio-doença</option>
                <option value="pensao">Pensão</option>
                <option value="maternidade">Maternidade</option>
                <option value="bpc-loas">BPC/LOAS</option>
                <option value="revisao">Revisão</option>
                <option value="outro">Outro</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-6 py-3">Contato</th>
                  <th className="px-4 py-3">Produto</th>
                  <th className="px-4 py-3">Tipo de benefício</th>
                  <th className="px-4 py-3">Funil</th>
                  <th className="px-4 py-3">Pagamento</th>
                  <th className="px-4 py-3">Valor</th>
                  <th className="px-4 py-3">Origem</th>
                  <th className="px-4 py-3">Atualizado</th>
                  <th className="px-6 py-3">Ação</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-6 py-12 text-center text-slate-400"
                    >
                      Nenhum lead encontrado com os filtros atuais.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="border-b border-slate-50 transition hover:bg-slate-50/80"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900">
                          {displayNome(lead.nome)}
                        </p>
                        <p className="text-xs text-slate-500">
                          {displayOptional(lead.email)}
                        </p>
                        <p className="text-xs text-slate-400">
                          {displayTelefone(lead.telefone)}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-slate-700">
                        {displayOptional(lead.produto)}
                      </td>
                      <td className="px-4 py-4">
                        <BenefitBadge beneficio={lead.tipo_beneficio} />
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge
                          label={lead.status_funil || '—'}
                          className={funnelBadgeClass(lead.status_funil)}
                          variant="funnel"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge
                          label={lead.status_pagamento}
                          className={paymentBadgeClass(lead.status_pagamento)}
                          variant="payment"
                        />
                      </td>
                      <td className="px-4 py-4 font-medium text-slate-800">
                        {lead.valor_centavos > 0
                          ? formatMoney(lead.valor_centavos)
                          : '—'}
                      </td>
                      <td className="px-4 py-4 capitalize text-slate-500">
                        {displayOptional(lead.origem)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-slate-500">
                        {formatDate(lead.updated_at || lead.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => setSelectedLead(lead)}
                          className="rounded-lg border border-[#1e3a5f]/20 bg-[#1e3a5f]/5 px-3 py-1.5 text-xs font-semibold text-[#1e3a5f] transition hover:bg-[#1e3a5f]/10"
                        >
                          Detalhes
                        </button>
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
            Falha ao atualizar: {fetchError}. Exibindo dados anteriores.
          </p>
        )}
      </main>

      {selectedLead && (
        <LeadDetailPanel
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
        />
      )}
    </div>
  );
}
