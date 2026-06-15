import { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBrewLogStore } from '../hooks/useBrewHistory';
import { METHOD_LABELS } from '../types';
import type { BrewLog, BrewMethod } from '../types';
import { formatDate } from '../lib/calculations';

const METHODS: BrewMethod[] = [
  'v60',
  'chemex',
  'french-press',
  'moka',
  'aeropress',
  'espresso',
];

type DateFilter = 'all' | '7days' | 'month';

const ITEMS_PER_PAGE = 20;

function getDateThreshold(filter: DateFilter): number {
  const now = Date.now();
  switch (filter) {
    case '7days':
      return now - 7 * 24 * 60 * 60 * 1000;
    case 'month':
      return now - 30 * 24 * 60 * 60 * 1000;
    default:
      return 0;
  }
}

function renderStars(rating: number): string {
  return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
}

function getMethodBadgeColor(method: BrewMethod): string {
  const colors: Record<BrewMethod, string> = {
    v60: 'bg-orange-100 text-orange-700',
    chemex: 'bg-amber-100 text-amber-700',
    'french-press': 'bg-blue-100 text-blue-700',
    moka: 'bg-red-100 text-red-700',
    aeropress: 'bg-green-100 text-green-700',
    espresso: 'bg-purple-100 text-purple-700',
  };
  return colors[method];
}

export default function HistoryPage() {
  const navigate = useNavigate();
  const logs = useBrewLogStore((s) => s.logs);
  const loadLogs = useBrewLogStore((s) => s.loadLogs);
  const deleteLog = useBrewLogStore((s) => s.deleteLog);

  const [methodFilter, setMethodFilter] = useState<BrewMethod | 'all'>('all');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // Load logs on mount
  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  // Reset pagination when filters change
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
    setExpandedId(null);
  }, [methodFilter, dateFilter]);

  // Filtered and sorted logs
  const filteredLogs = useMemo(() => {
    const threshold = getDateThreshold(dateFilter);

    return logs
      .filter((log) => {
        if (methodFilter !== 'all' && log.method !== methodFilter) return false;
        if (dateFilter !== 'all' && log.date < threshold) return false;
        return true;
      })
      .sort((a, b) => b.date - a.date);
  }, [logs, methodFilter, dateFilter]);

  // Paginated logs
  const paginatedLogs = useMemo(
    () => filteredLogs.slice(0, visibleCount),
    [filteredLogs, visibleCount],
  );

  const hasMore = visibleCount < filteredLogs.length;

  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  }, []);

  const handleDelete = useCallback(
    async (log: BrewLog) => {
      const confirmed = window.confirm(
        `¿Eliminar la preparación de "${log.recipeName}" del ${formatDate(log.date)}?`,
      );
      if (!confirmed) return;
      await deleteLog(log.id);
      if (expandedId === log.id) {
        setExpandedId(null);
      }
    },
    [deleteLog, expandedId],
  );

  const toggleExpand = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  return (
    <div className="p-4 pb-8">
      <h1 className="text-2xl font-bold text-coffee-text mb-5">Historial</h1>

      {/* Method filter tabs */}
      <div className="mb-4 overflow-x-auto">
        <div className="flex gap-2 pb-1 min-w-max">
          <button
            onClick={() => setMethodFilter('all')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
              methodFilter === 'all'
                ? 'bg-coffee-primary text-white shadow-sm'
                : 'bg-white border border-coffee-primary-light/20 text-coffee-text hover:bg-coffee-bg'
            }`}
          >
            Todos
          </button>
          {METHODS.map((m) => (
            <button
              key={m}
              onClick={() => setMethodFilter(m)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                methodFilter === m
                  ? 'bg-coffee-primary text-white shadow-sm'
                  : 'bg-white border border-coffee-primary-light/20 text-coffee-text hover:bg-coffee-bg'
              }`}
            >
              {METHOD_LABELS[m]}
            </button>
          ))}
        </div>
      </div>

      {/* Date filter */}
      <div className="flex gap-2 mb-6">
        {([
          { value: 'all', label: 'Todos' },
          { value: '7days', label: 'Últimos 7 días' },
          { value: 'month', label: 'Último mes' },
        ] as { value: DateFilter; label: string }[]).map((opt) => (
          <button
            key={opt.value}
            onClick={() => setDateFilter(opt.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              dateFilter === opt.value
                ? 'bg-coffee-primary-light/20 text-coffee-primary'
                : 'bg-white border border-coffee-primary-light/10 text-coffee-muted hover:bg-coffee-bg'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {filteredLogs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <span className="text-5xl mb-4">📋</span>
          <p className="text-coffee-muted text-sm mb-4 max-w-xs">
            Todavía no registraste ninguna preparación. ¡Empezá con una receta!
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-coffee-primary text-white px-6 py-3 rounded-xl font-medium text-sm shadow-sm hover:bg-coffee-primary-light transition-colors cursor-pointer"
          >
            Ir a recetas
          </button>
        </div>
      )}

      {/* Logs list */}
      <div className="space-y-3">
        {paginatedLogs.map((log) => {
          const isExpanded = expandedId === log.id;
          return (
            <div
              key={log.id}
              className="bg-white rounded-xl shadow-sm border border-coffee-primary-light/10 overflow-hidden transition-shadow hover:shadow-md"
            >
              {/* Summary row (always visible) */}
              <button
                onClick={() => toggleExpand(log.id)}
                className="w-full text-left p-4 cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-coffee-text text-sm truncate">
                      {log.recipeName}
                    </h3>
                    <p className="text-xs text-coffee-muted mt-0.5">
                      {formatDate(log.date)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${getMethodBadgeColor(log.method)}`}
                    >
                      {METHOD_LABELS[log.method]}
                    </span>
                    <span className="text-sm">{'⭐'.repeat(log.rating)}</span>
                  </div>
                </div>

                {log.notes && !isExpanded && (
                  <p className="text-xs text-coffee-muted mt-2 truncate">
                    {log.notes.slice(0, 50)}
                    {log.notes.length > 50 ? '...' : ''}
                  </p>
                )}
              </button>

              {/* Expanded detail */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-0 border-t border-coffee-primary-light/10">
                  {log.notes && (
                    <div className="mt-3">
                      <p className="text-xs font-medium text-coffee-muted uppercase tracking-wide mb-1">
                        Notas
                      </p>
                      <p className="text-sm text-coffee-text whitespace-pre-wrap">
                        {log.notes}
                      </p>
                    </div>
                  )}

                  {log.adjustments && (
                    <div className="mt-3">
                      <p className="text-xs font-medium text-coffee-muted uppercase tracking-wide mb-1">
                        Ajustes realizados
                      </p>
                      <p className="text-sm text-coffee-text">
                        {log.adjustments}
                      </p>
                    </div>
                  )}

                  <div className="mt-3 flex items-center gap-4 text-xs text-coffee-muted">
                    <span>Rating: {renderStars(log.rating)}</span>
                  </div>

                  <button
                    onClick={() => handleDelete(log)}
                    className="mt-3 text-xs text-red-500 hover:text-red-700 font-medium transition-colors cursor-pointer"
                  >
                    Eliminar
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Load more */}
      {hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleLoadMore}
            className="bg-white border border-coffee-primary-light/20 text-coffee-text px-6 py-3 rounded-xl text-sm font-medium hover:bg-coffee-bg transition-colors cursor-pointer"
          >
            Cargar más ({filteredLogs.length - visibleCount} restantes)
          </button>
        </div>
      )}
    </div>
  );
}
