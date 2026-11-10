import Link from 'next/link';
import SearchBox from './SearchBox';

export default function Header({ search = true, query = '' }: { search?: boolean; query?: string }) {
  return (
    <header className="site-header">
      <Link href="/" className="logo">recipe book.</Link>
      {search ? <SearchBox initial={query} /> : null}
    </header>
  );
}
