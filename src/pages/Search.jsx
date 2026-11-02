import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Search as SearchIcon, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { programsApi } from '../api/services';
import ProgramCard from '../components/ProgramCard';
import FilterChips from '../components/FilterChips';
import Skeleton from '../components/Skeleton';
import EmptyState from '../components/EmptyState';

const BACS = ['SM', 'PC', 'SVT', 'ECO', 'LETTRES', 'STE', 'STM'].map((b) => ({ label: b, value: b }));
const TYPES = [
  { label: 'Écoles', value: 'ecole' },
  { label: 'Universités', value: 'universite' },
];
const STATUT = [
  { label: 'Public', value: 'true' },
  { label: 'Privé', value: 'false' },
];

export default function Search() {
  const [params] = useSearchParams();
  const [search, setSearch] = useState(params.get('search') ?? '');
  const [debounced, setDebounced] = useState(search);
  const [filters, setFilters] = useState({
    bac: params.get('bac') ?? undefined,
    type: params.get('type') ?? undefined,
    public: params.get('public') ?? undefined,
    ville: undefined,
  });

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const query = { search: debounced || undefined, ...filters };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error } =
    useInfiniteQuery({
      queryKey: ['programs', 'search', query],
      queryFn: ({ pageParam }) => programsApi.list({ ...query, page: pageParam }),
      initialPageParam: 1,
      getNextPageParam: (last) =>
        last.meta.current_page < last.meta.last_page ? last.meta.current_page + 1 : undefined,
    });

  const items = data?.pages.flatMap((p) => p.data) ?? [];
  const total = data?.pages[0]?.meta?.total ?? 0;
  const setF = (k) => (v) => setFilters((f) => ({ ...f, [k]: v }));
  const reset = () => {
    setSearch('');
    setFilters({ bac: undefined, type: undefined, public: undefined, ville: undefined });
  };

  return (
    <>
      <h1 className="page-title">Rechercher une formation</h1>
      <p className="muted" style={{ margin: 0 }}>Filtre par bac, type d'établissement, statut et ville.</p>

      <div className="search-layout">
        <aside className="filters">
          <h3><SlidersHorizontal size={16} /> Filtres</h3>

          <div className="search-field">
            <SearchIcon size={16} />
            <input className="input" placeholder="Mot-clé..."
              value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <input className="input" placeholder="Ville (ex : Marrakech)"
            value={filters.ville ?? ''} onChange={(e) => setF('ville')(e.target.value || undefined)} />

          <div className="filter-title">Type de bac</div>
          <FilterChips options={BACS} value={filters.bac} onChange={setF('bac')} />
          <div className="filter-title">Établissement</div>
          <FilterChips options={TYPES} value={filters.type} onChange={setF('type')} />
          <div className="filter-title">Statut</div>
          <FilterChips options={STATUT} value={filters.public} onChange={setF('public')} />

          <button className="btn outline small full" onClick={reset}>
            <RotateCcw size={14} /> Réinitialiser
          </button>
        </aside>

        <section>
          {isLoading ? <Skeleton count={4} /> : isError ? (
            <div className="error">
              Impossible de charger les filières : {error.message}
              {error.response && ` (code ${error.response.status})`}
            </div>
          ) : (
            <>
              <div className="results-bar">
                <strong>{total} résultat{total > 1 ? 's' : ''}</strong>
              </div>
              {items.length === 0 ? (
                <EmptyState title="Aucun résultat" text="Essaie d'enlever un filtre ou de changer le mot-clé."
                  action={<button className="btn outline small" onClick={reset}>Réinitialiser</button>} />
              ) : (
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
                  {items.map((p) => <ProgramCard key={p.id} program={p} />)}
                </div>
              )}
              {hasNextPage && (
                <div className="center">
                  <button className="btn outline" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                    {isFetchingNextPage ? 'Chargement...' : 'Voir plus'}
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </>
  );
}