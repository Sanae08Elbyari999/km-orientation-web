import { useQuery } from '@tanstack/react-query';
import { favoritesApi } from '../api/services';
import ProgramCard from '../components/ProgramCard';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';


export default function Favorites() {
  const { data, isLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: favoritesApi.list,
  });

  if (isLoading) return <Loader />;

  return (
    <>
      <h1 className="page-title">Mes favoris</h1>
      <div className="grid">
        {data?.data.map((p) => <ProgramCard key={p.id} program={p} />)}
      </div>
      {data?.data.length === 0 && (
        <EmptyState title="Aucun favori" text="Clique sur le cœur dans une filière pour l'ajouter ici." />
        )}
    </>
  );
}