import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-sm font-sans">
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-2">
          {index > 0 && (
            <span className="text-gray-400">&gt;</span>
          )}
          {item.href ? (
            <Link
              to={item.href}
              className="font-sans font-normal text-sm leading-5 tracking-normal text-slate-950 no-underline"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-950">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
