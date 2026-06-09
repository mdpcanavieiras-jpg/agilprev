import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const API_URL = 'https://agilprev-production.up.railway.app';
const ADMIN_SESSION_KEY = 'agilprev_admin_auth';
const LOGO_URL = '/agilprev-watermark.png';

type NavSection = 'visao-geral' | 'relatorios' | 'leads';

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

function getInitials(nome: string): string {
  const label = displayNome(nome);
  if (label === 'Lead sem nome') return '?';
  const parts = label.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function scrollToSection(sectionId: string, onDone?: () => void) {
  document.getElementById(sectionId)?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
  onDone?.();
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

interface BenefitGroupStats {
  label: string;
  leads: number;
  payments: number;
  revenueCents: number;
}

function computeBenefitStats(leads: Lead[]): BenefitGroupStats[] {
  const map = new Map<string, BenefitGroupStats>();

  for (const lead of leads) {
    const label = displayBeneficio(lead.tipo_beneficio);
    const entry = map.get(label) ?? {
      label,
      leads: 0,
      payments: 0,
      revenueCents: 0,
    };

    entry.leads += 1;
    if (isPaid(lead.status_pagamento)) {
      entry.payments += 1;
      entry.revenueCents += Number(lead.valor_centavos) || 0;
    }

    map.set(label, entry);
  }

  return Array.from(map.values()).sort((a, b) => {
    if (b.leads !== a.leads) return b.leads - a.leads;
    return a.label.localeCompare(b.label, 'pt-BR');
  });
}

function BenefitSummarySection({ leads }: { leads: Lead[] }) {
  const stats = useMemo(() => computeBenefitStats(leads), [leads]);
  const maxLeads = stats[0]?.leads ?? 0;

  return (
    <section
      id="relatorios"
      className="scroll-mt-24 overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm"
    >
      <div className="border-b border-slate-100 px-6 py-5">
        <h2 className="text-lg font-bold text-[#1e3a5f]">
          Resumo por tipo de benefício
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Distribuição de leads, pagamentos e faturamento com base nos dados
          atuais
        </p>
      </div>

      {stats.length === 0 ? (
        <div className="px-6 py-12 text-center text-sm text-slate-400">
          Nenhum dado de benefício disponível ainda.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-3">
          <div className="overflow-x-auto lg:col-span-2">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="pb-3 pr-4">Tipo de benefício</th>
                  <th className="pb-3 pr-4 text-right">Leads</th>
                  <th className="pb-3 pr-4 text-right">Pagamentos</th>
                  <th className="pb-3 text-right">Faturamento</th>
                </tr>
              </thead>
              <tbody>
                {stats.map((row) => (
                  <tr
                    key={row.label}
                    className="border-b border-slate-50 last:border-0"
                  >
                    <td className="py-3 pr-4 font-medium text-slate-800">
                      {row.label}
                    </td>
                    <td className="py-3 pr-4 text-right tabular-nums text-slate-700">
                      {row.leads}
                    </td>
                    <td className="py-3 pr-4 text-right tabular-nums text-slate-700">
                      {row.payments}
                    </td>
                    <td className="py-3 text-right tabular-nums font-medium text-slate-800">
                      {row.revenueCents > 0
                        ? formatMoney(row.revenueCents)
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <td className="py-3 pr-4">Total</td>
                  <td className="py-3 pr-4 text-right tabular-nums text-[#1e3a5f]">
                    {stats.reduce((sum, r) => sum + r.leads, 0)}
                  </td>
                  <td className="py-3 pr-4 text-right tabular-nums text-[#1e3a5f]">
                    {stats.reduce((sum, r) => sum + r.payments, 0)}
                  </td>
                  <td className="py-3 text-right tabular-nums text-[#1e3a5f]">
                    {formatMoney(
                      stats.reduce((sum, r) => sum + r.revenueCents, 0)
                    )}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-5">
            <h3 className="text-sm font-bold text-[#1e3a5f]">
              Benefícios mais procurados
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Ranking por volume de leads
            </p>
            <ol className="mt-4 space-y-3">
              {stats.map((row, index) => {
                const barWidth =
                  maxLeads > 0 ? Math.round((row.leads / maxLeads) * 100) : 0;

                return (
                  <li key={row.label}>
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <span className="flex min-w-0 items-center gap-2">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1e3a5f]/10 text-xs font-bold text-[#1e3a5f]">
                          {index + 1}
                        </span>
                        <span className="truncate font-medium text-slate-800">
                          {row.label}
                        </span>
                      </span>
                      <span className="shrink-0 tabular-nums text-xs font-semibold text-slate-600">
                        {row.leads} lead{row.leads === 1 ? '' : 's'}
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-[#1e3a5f]/70 transition-all"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      )}
    </section>
  );
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

function LeadsEmptyState({
  totalLeads,
  onClearFilters,
}: {
  totalLeads: number;
  onClearFilters: () => void;
}) {
  const filteredEmpty = totalLeads > 0;

  return (
    <div className="px-6 py-16 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-7 w-7"
          aria-hidden
        >
          {filteredEmpty ? (
            <>
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
              <path d="M8 11h6" />
            </>
          ) : (
            <>
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </>
          )}
        </svg>
      </div>
      <p className="text-base font-semibold text-slate-700">
        {filteredEmpty
          ? 'Nenhum lead encontrado'
          : 'Nenhum lead registrado ainda'}
      </p>
      <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
        {filteredEmpty
          ? 'Nenhum registro corresponde aos filtros ou à busca atuais. Tente ampliar os critérios ou limpar os filtros.'
          : 'Quando usuários iniciarem o fluxo no site, os registros aparecerão aqui automaticamente.'}
      </p>
      {filteredEmpty && (
        <button
          type="button"
          onClick={onClearFilters}
          className="mt-6 rounded-xl border border-[#1e3a5f]/20 bg-[#1e3a5f]/5 px-5 py-2.5 text-sm font-semibold text-[#1e3a5f] transition hover:bg-[#1e3a5f]/10"
        >
          Limpar filtros
        </button>
      )}
    </div>
  );
}

function LeadCard({
  lead,
  onSelect,
}: {
  lead: Lead;
  onSelect: () => void;
}) {
  return (
    <article className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <ContactAvatar nome={lead.nome} size="sm" />
          <div className="min-w-0">
            <p className="font-medium text-slate-900">{displayNome(lead.nome)}</p>
            <p className="mt-0.5 truncate text-xs text-slate-500">
              {displayOptional(lead.email)}
            </p>
            <p
              className={`mt-0.5 text-xs ${hasTelefone(lead.telefone) ? 'text-slate-400' : 'italic text-slate-400'}`}
            >
              {displayTelefone(lead.telefone)}
            </p>
          </div>
        </div>
        <p className="shrink-0 text-sm font-semibold text-slate-800">
          {lead.valor_centavos > 0 ? formatMoney(lead.valor_centavos) : '—'}
        </p>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <BenefitBadge beneficio={lead.tipo_beneficio} />
        <StatusBadge
          label={lead.status_funil || '—'}
          className={funnelBadgeClass(lead.status_funil)}
          variant="funnel"
        />
        <StatusBadge
          label={lead.status_pagamento}
          className={paymentBadgeClass(lead.status_pagamento)}
          variant="payment"
        />
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 border-t border-slate-50 pt-3">
        <div className="min-w-0 text-xs text-slate-500">
          <p className="truncate capitalize">{displayOptional(lead.produto)}</p>
          <p className="mt-0.5">
            {formatDate(lead.updated_at || lead.created_at)}
          </p>
        </div>
        <button
          type="button"
          onClick={onSelect}
          className="shrink-0 rounded-lg border border-[#1e3a5f]/20 bg-[#1e3a5f]/5 px-3 py-1.5 text-xs font-semibold text-[#1e3a5f] transition hover:bg-[#1e3a5f]/10"
        >
          Detalhes
        </button>
      </div>
    </article>
  );
}

type StatCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  accent: 'blue' | 'green' | 'lime' | 'slate' | 'amber' | 'violet';
};

function ContactAvatar({
  nome,
  size = 'md',
  variant = 'light',
}: {
  nome: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
}) {
  const sizeClass =
    size === 'sm'
      ? 'h-9 w-9 text-xs'
      : size === 'lg'
        ? 'h-12 w-12 text-base'
        : 'h-10 w-10 text-sm';

  const colorClass =
    variant === 'dark'
      ? 'bg-white/15 text-white'
      : 'bg-[#2563EB]/10 text-[#1e3a5f]';

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-bold ${colorClass} ${sizeClass}`}
      aria-hidden
    >
      {getInitials(nome)}
    </div>
  );
}

function ContactCell({ lead }: { lead: Lead }) {
  return (
    <div className="flex items-center gap-3">
      <ContactAvatar nome={lead.nome} size="sm" />
      <div className="min-w-0">
        <p className="font-medium text-slate-900">{displayNome(lead.nome)}</p>
        <p className="truncate text-xs text-slate-500">
          {displayOptional(lead.email)}
        </p>
        <p
          className={`text-xs ${hasTelefone(lead.telefone) ? 'text-slate-400' : 'italic text-slate-400'}`}
        >
          {displayTelefone(lead.telefone)}
        </p>
      </div>
    </div>
  );
}

function StatCardIcon({ accent }: { accent: StatCardProps['accent'] }) {
  const bgMap: Record<StatCardProps['accent'], string> = {
    blue: 'bg-[#2563EB]/10 text-[#2563EB]',
    green: 'bg-emerald-100 text-emerald-600',
    lime: 'bg-lime-100 text-lime-600',
    slate: 'bg-slate-100 text-slate-600',
    amber: 'bg-amber-100 text-amber-600',
    violet: 'bg-violet-100 text-violet-600',
  };

  const paths: Record<StatCardProps['accent'], React.ReactNode> = {
    blue: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
      />
    ),
    green: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
    lime: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
      />
    ),
    slate: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
    amber: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
    violet: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
      />
    ),
  };

  return (
    <div
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${bgMap[accent]}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-5 w-5"
        aria-hidden
      >
        {paths[accent]}
      </svg>
    </div>
  );
}

function StatCard({ title, value, subtitle, accent }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-[#1e3a5f] sm:text-[1.75rem]">
            {value}
          </p>
          {subtitle && (
            <p className="mt-1.5 text-xs text-slate-400">{subtitle}</p>
          )}
        </div>
        <StatCardIcon accent={accent} />
      </div>
    </div>
  );
}

const NAV_ITEMS: {
  section: NavSection;
  targetId: string;
  label: string;
}[] = [
  { section: 'visao-geral', targetId: 'visao-geral', label: 'Visão geral' },
  {
    section: 'relatorios',
    targetId: 'relatorios',
    label: 'Relatórios por benefício',
  },
  { section: 'leads', targetId: 'leads', label: 'Leads' },
];

function AdminSidebar({
  activeSection,
  onNavigate,
  onLogout,
  mobileOpen,
  onCloseMobile,
}: {
  activeSection: NavSection;
  onNavigate: (section: NavSection, targetId: string) => void;
  onLogout: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#1e3a5f] text-white shadow-xl transition-transform duration-200 lg:translate-x-0 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
      aria-label="Navegação principal"
    >
      <div className="border-b border-white/10 px-5 py-5">
        <div className="flex items-center gap-3">
          <img
            src={LOGO_URL}
            alt="Agilprev"
            className="h-9 w-9 rounded-lg bg-white/10 object-contain p-1"
          />
          <div>
            <p className="text-sm font-bold leading-tight">
              <span className="text-[#84CC16]">Agil</span>
              <span className="text-[#3B82F6]">prev</span>
            </p>
            <p className="text-[11px] text-white/60">Painel Admin</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const active = activeSection === item.section;
          return (
            <button
              key={item.section}
              type="button"
              onClick={() => onNavigate(item.section, item.targetId)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                active
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span
                className={`h-2 w-2 shrink-0 rounded-full ${active ? 'bg-[#22C55E]' : 'bg-white/30'}`}
                aria-hidden
              />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <button
          type="button"
          onClick={() => {
            onCloseMobile();
            onLogout();
          }}
          className="flex w-full items-center justify-center rounded-xl border border-white/20 px-4 py-2.5 text-sm font-medium text-white/90 transition hover:bg-white/10"
        >
          Sair
        </button>
      </div>
    </aside>
  );
}

function AdminTopBar({
  lastUpdated,
  loadState,
  onRefresh,
  onLogout,
  onMenuClick,
}: {
  lastUpdated: Date | null;
  loadState: LoadState;
  onRefresh: () => void;
  onLogout: () => void;
  onMenuClick: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-start gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 lg:hidden"
            aria-label="Abrir menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-5 w-5"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold text-[#1e3a5f] sm:text-xl">
              Painel Administrativo
            </h1>
            <p className="mt-0.5 text-sm text-slate-500">
              Gestão de leads, pagamentos e conversões
            </p>
            {lastUpdated && (
              <p className="mt-1 text-xs text-slate-400">
                Atualizado em {formatDate(lastUpdated.toISOString())}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onRefresh}
            disabled={loadState === 'loading'}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-[#1e3a5f] transition hover:bg-slate-50 disabled:opacity-50"
          >
            {loadState === 'loading' ? 'Atualizando…' : 'Atualizar'}
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="hidden rounded-xl bg-[#1e3a5f] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#162d4a] sm:inline-flex"
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}

function AdminLayout({
  children,
  lastUpdated,
  loadState,
  onRefresh,
  onLogout,
  activeSection,
  onNavigate,
}: {
  children: React.ReactNode;
  lastUpdated: Date | null;
  loadState: LoadState;
  onRefresh: () => void;
  onLogout: () => void;
  activeSection: NavSection;
  onNavigate: (section: NavSection, targetId: string) => void;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavigate = (section: NavSection, targetId: string) => {
    onNavigate(section, targetId);
    scrollToSection(targetId, () => setSidebarOpen(false));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          aria-label="Fechar menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <AdminSidebar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onLogout={onLogout}
        mobileOpen={sidebarOpen}
        onCloseMobile={() => setSidebarOpen(false)}
      />

      <div className="lg:pl-64">
        <AdminTopBar
          lastUpdated={lastUpdated}
          loadState={loadState}
          onRefresh={onRefresh}
          onLogout={onLogout}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {children}
        </div>
      </div>
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
          <img
            src={LOGO_URL}
            alt="Agilprev"
            className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-slate-50 object-contain p-2"
          />
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
      <img
        src={LOGO_URL}
        alt="Agilprev"
        className="mb-6 h-12 w-12 rounded-xl bg-white object-contain p-1 shadow-sm"
      />
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#1e3a5f]" />
      <p className="mt-4 text-sm font-medium text-slate-600">
        Carregando painel administrativo…
      </p>
    </div>
  );
}

function DetailRow({
  label,
  value,
  muted,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </dt>
      <dd
        className={`mt-1 break-words text-sm ${muted ? 'italic text-slate-400' : 'text-slate-800'}`}
      >
        {value}
      </dd>
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
        <div className="flex items-center gap-4 border-b border-white/10 bg-[#1e3a5f] px-6 py-5 text-white">
          <ContactAvatar nome={lead.nome} size="lg" variant="dark" />
          <div className="min-w-0">
            <h2 id="lead-detail-title" className="truncate text-lg font-bold">
              {displayNome(lead.nome)}
            </h2>
            <p className="text-sm text-white/70">Detalhes do lead</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <dl className="space-y-5">
            <DetailRow label="ID da sessão" value={lead.id} />
            <DetailRow label="Nome" value={displayNome(lead.nome)} />
            <DetailRow label="E-mail" value={displayOptional(lead.email)} />
            <DetailRow
              label="Telefone"
              value={displayTelefone(lead.telefone)}
              muted={!phoneOk}
            />
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
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-4 w-4"
                    aria-hidden
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.884 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
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
  const [activeSection, setActiveSection] = useState<NavSection>('visao-geral');
  const dataRef = useRef<DashboardData | null>(null);
  dataRef.current = data;

  const clearFilters = useCallback(() => {
    setSearch('');
    setPaymentFilter('all');
    setProductFilter('all');
    setBenefitFilter('all');
  }, []);

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
    <AdminLayout
      lastUpdated={lastUpdated}
      loadState={loadState}
      onRefresh={fetchDashboard}
      onLogout={handleLogout}
      activeSection={activeSection}
      onNavigate={setActiveSection}
    >
        <section
          id="visao-geral"
          className="scroll-mt-24 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
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

        <BenefitSummarySection leads={data.leads} />

        <section
          id="leads"
          className="scroll-mt-24 overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm"
        >
          <div className="border-b border-slate-100 px-6 py-5">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-[#1e3a5f]">Leads</h2>
              <p className="mt-1 text-sm text-slate-500">
                {filteredLeads.length} de {data.leads.length} registros
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label
                  htmlFor="admin-search"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400"
                >
                  Busca
                </label>
                <input
                  id="admin-search"
                  type="search"
                  placeholder="Nome, e-mail, telefone, produto…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20"
                />
              </div>
              <div>
                <label
                  htmlFor="admin-payment-filter"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400"
                >
                  Pagamento
                </label>
                <select
                  id="admin-payment-filter"
                  value={paymentFilter}
                  onChange={(e) =>
                    setPaymentFilter(e.target.value as PaymentFilter)
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#1e3a5f]"
                >
                  <option value="all">Todos</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="sem_pagamento">Sem pagamento</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="admin-product-filter"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400"
                >
                  Produto
                </label>
                <select
                  id="admin-product-filter"
                  value={productFilter}
                  onChange={(e) =>
                    setProductFilter(e.target.value as ProductFilter)
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#1e3a5f]"
                >
                  <option value="all">Todos</option>
                  <option value="documento">Documento</option>
                  <option value="premium">Premium</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="admin-benefit-filter"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400"
                >
                  Benefício
                </label>
                <select
                  id="admin-benefit-filter"
                  value={benefitFilter}
                  onChange={(e) =>
                    setBenefitFilter(e.target.value as BenefitFilter)
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#1e3a5f]"
                >
                  <option value="all">Todos</option>
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
          </div>

          {filteredLeads.length === 0 ? (
            <LeadsEmptyState
              totalLeads={data.leads.length}
              onClearFilters={clearFilters}
            />
          ) : (
            <>
              <div className="space-y-3 p-4 md:hidden">
                {filteredLeads.map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    onSelect={() => setSelectedLead(lead)}
                  />
                ))}
              </div>

              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[960px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      <th className="px-6 py-3.5">Contato</th>
                      <th className="px-4 py-3.5">Produto</th>
                      <th className="px-4 py-3.5">Tipo de benefício</th>
                      <th className="px-4 py-3.5">Funil</th>
                      <th className="px-4 py-3.5">Pagamento</th>
                      <th className="px-4 py-3.5">Valor</th>
                      <th className="px-4 py-3.5">Origem</th>
                      <th className="px-4 py-3.5">Atualizado</th>
                      <th className="px-6 py-3.5">Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map((lead) => (
                      <tr
                        key={lead.id}
                        className="border-b border-slate-50 transition hover:bg-slate-50/80"
                      >
                        <td className="px-6 py-4">
                          <ContactCell lead={lead} />
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
                            className={paymentBadgeClass(
                              lead.status_pagamento
                            )}
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
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>

        {fetchError && loadState === 'success' && (
          <p className="text-center text-sm text-amber-600" role="status">
            Falha ao atualizar: {fetchError}. Exibindo dados anteriores.
          </p>
        )}

      {selectedLead && (
        <LeadDetailPanel
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
        />
      )}
    </AdminLayout>
  );
}
