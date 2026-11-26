import Link from 'next/link';
import SearchBox from './SearchBox';

export default function Header({
  search = true,
  query = '',
  current
}: {
  search?: boolean;
  query?: string;
  current?: 'tips';
}) {
  return (
    <header className="site-header">
      <Link href="/" className="logo">recipe book.</Link>
      <nav aria-label="Site" className="site-nav">
        <Link href="/tips" className="nav-link" aria-current={current === 'tips' ? 'page' : undefined}>
          Tips
        </Link>
      </nav>
      {search ? <SearchBox initial={query} /> : null}
    </header>
  );
}
