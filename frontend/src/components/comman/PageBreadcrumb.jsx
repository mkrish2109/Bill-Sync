export default function PageBreadcrumb({ pageTitle }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-title-md2 font-semibold text-black dark:text-white">
        {pageTitle}
      </h2>
      <nav>
        <ol className="flex items-center gap-2">
          <li>
            <a className="font-medium" href="/">
              Dashboard /
            </a>
          </li>
          <li className="font-medium text-primary">{pageTitle}</li>
        </ol>
      </nav>
    </div>
  );
}