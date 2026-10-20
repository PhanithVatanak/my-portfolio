import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-slate-50 dark:bg-[#0b1120] text-slate-900 dark:text-slate-100">
      <div className="size-16 rounded-2xl bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center text-2xl font-bold font-mono mb-4">
        404
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold font-display mb-2">Page Not Found</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">
        The requested vault node or page could not be located in the current architecture.
      </p>
      <Link
        href="/"
        className="px-6 py-2.5 rounded-full bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-md shadow-sky-600/25 transition-all"
      >
        Return to Home
      </Link>
    </div>
  );
}
