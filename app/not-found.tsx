import Header from '@/components/Header';

export default function NotFound() {
  return (
    <div className="shell">
      <div className="wrap">
        <Header />
        <main id="main" className="empty-card paper">
          <span className="big">That page isn&apos;t in the book.</span>
          <p>Search for a recipe, or start from the categories on the home page.</p>
        </main>
      </div>
    </div>
  );
}
