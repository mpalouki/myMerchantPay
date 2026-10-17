// Footer of a server-paginated table: "Affichage de a à b sur n entrées" and « 1 2 3 4 5 »
// (up to PAGE_WINDOW page buttons around the current one). `page` is 1-indexed.
const PAGE_WINDOW = 5;

export default function TablePagination({ page, pageSize, total, onPage }) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const first = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const last = Math.min(total, page * pageSize);
  const windowStart = Math.max(1, Math.min(page - Math.floor(PAGE_WINDOW / 2), pageCount - PAGE_WINDOW + 1));
  const pages = Array.from({ length: Math.min(PAGE_WINDOW, pageCount) }, (_, i) => windowStart + i);

  return (
    <div className="table-footer">
      {total === 0 ? 'Aucune donnée disponible' : `Affichage de ${first} à ${last} sur ${total} entrées`}
      <div className="table-pagination">
        <button type="button" onClick={() => onPage(page - 1)} disabled={page <= 1} aria-label="Page précédente">
          &laquo;
        </button>
        {pages.map((n) => (
          <button
            key={n}
            type="button"
            className={n === page ? 'is-active' : undefined}
            onClick={() => onPage(n)}
            aria-current={n === page ? 'page' : undefined}
          >
            {n}
          </button>
        ))}
        <button type="button" onClick={() => onPage(page + 1)} disabled={page >= pageCount} aria-label="Page suivante">
          &raquo;
        </button>
      </div>
    </div>
  );
}
