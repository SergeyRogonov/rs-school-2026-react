import SearchResultsPage from '../../components/SearchResultsPage';

interface Props {
  searchParams: Promise<{
    page?: string;
    search?: string;
    details?: string;
  }>;
}

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;

  return (
    <SearchResultsPage
      page={Number(params.page ?? 1)}
      search={params.search ?? ''}
      details={params.details}
    />
  );
}
