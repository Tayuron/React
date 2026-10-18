import { useState } from 'react';
import s from './ProductImage.module.css';

const SHAPES = {
  cpu: <><rect x="18" y="18" width="28" height="28" rx="3" /><rect x="26" y="26" width="12" height="12" rx="1" /><path d="M24 10v8M32 10v8M40 10v8M24 46v8M32 46v8M40 46v8M10 24h8M10 32h8M10 40h8M46 24h8M46 32h8M46 40h8" /></>,
  gpu: <><rect x="6" y="20" width="48" height="26" rx="3" /><circle cx="22" cy="33" r="8" /><circle cx="40" cy="33" r="8" /><path d="M54 24h4v18h-4M12 46v6h12v-6" /></>,
  ram: <><rect x="6" y="22" width="52" height="20" rx="2" /><rect x="12" y="27" width="8" height="10" /><rect x="24" y="27" width="8" height="10" /><rect x="36" y="27" width="8" height="10" /><rect x="48" y="27" width="6" height="10" /><path d="M28 42v5h4v-5" /></>,
  ssd: <><rect x="12" y="14" width="40" height="36" rx="4" /><rect x="20" y="22" width="14" height="10" rx="1" /><path d="M20 40h24" /></>,
  hdd: <><rect x="12" y="12" width="40" height="40" rx="4" /><circle cx="32" cy="30" r="10" /><circle cx="32" cy="30" r="2" /><path d="M22 46h20" /></>,
  psu: <><rect x="10" y="16" width="44" height="32" rx="3" /><circle cx="26" cy="32" r="9" /><path d="M26 23v18M17 32h18M45 24v4M45 36v4" /></>,
  case: <><rect x="18" y="8" width="28" height="48" rx="3" /><circle cx="32" cy="22" r="6" /><circle cx="32" cy="40" r="6" /><path d="M22 50h20" /></>,
  cooler: <><rect x="12" y="12" width="40" height="40" rx="4" /><circle cx="32" cy="32" r="12" /><path d="M32 20v24M20 32h24" /></>,
  fans: <><circle cx="32" cy="32" r="22" /><circle cx="32" cy="32" r="4" /><path d="M32 28c0-8 6-12 10-10M36 32c8 0 12 6 10 10M32 36c0 8-6 12-10 10M28 32c-8 0-12-6-10-10" /></>,
  cables: <><rect x="12" y="16" width="12" height="12" rx="2" /><rect x="40" y="36" width="12" height="12" rx="2" /><path d="M24 22c16 0 4 20 16 20" /></>,
  wifi: <><path d="M8 26c13-12 35-12 48 0M16 34c9-8 23-8 32 0M24 42c5-4 11-4 16 0" /><circle cx="32" cy="50" r="2" /></>,
  os: <><rect x="10" y="12" width="20" height="18" rx="1" /><rect x="34" y="10" width="20" height="20" rx="1" /><rect x="10" y="34" width="20" height="20" rx="1" /><rect x="34" y="34" width="20" height="18" rx="1" /></>,
  motherboard: <><rect x="10" y="10" width="44" height="44" rx="3" /><rect x="16" y="16" width="14" height="14" /><path d="M38 16v18M44 16v18M16 42h28M16 48h20" /></>,
  mouse: <><rect x="20" y="8" width="24" height="48" rx="12" /><path d="M20 26h24M32 12v8" /></>,
  keyboard: <><rect x="6" y="18" width="52" height="28" rx="3" /><path d="M12 26h4M20 26h4M28 26h4M36 26h4M44 26h4M12 32h4M20 32h4M28 32h4M36 32h4M44 32h4M16 39h32" /></>,
  monitor: <><rect x="8" y="12" width="48" height="30" rx="2" /><path d="M26 54h12M32 42v12" /></>,
  headset: <><path d="M12 36V30a20 20 0 0 1 40 0v6" /><rect x="8" y="34" width="10" height="16" rx="3" /><rect x="46" y="34" width="10" height="16" rx="3" /></>,
  mousepad: <><rect x="6" y="14" width="52" height="36" rx="5" /><rect x="26" y="24" width="12" height="18" rx="6" /></>,
  webcam: <><circle cx="32" cy="26" r="14" /><circle cx="32" cy="26" r="6" /><path d="M24 54h16M32 40v14" /></>,
};
SHAPES.pc = SHAPES.case;

// Показує фото товару; без фото — ілюстрація за типом (kind), а без kind — літери.
export function ProductImage({ src, alt = '', label = '', kind, className = '' }) {
  const [failedSrc, setFailedSrc] = useState(null);

  if (!src || failedSrc === src) {
    const shape = SHAPES[kind];
    return (
      <div className={`${s.fallback} ${className}`} role={alt ? 'img' : undefined} aria-label={alt || undefined}>
        {shape ? (
          <svg className={s.icon} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" data-kind={kind} aria-hidden="true">
            {shape}
          </svg>
        ) : (
          <span aria-hidden="true">{label.slice(0, 2)}</span>
        )}
      </div>
    );
  }
  return <img className={className} src={src} alt={alt} loading="lazy" onError={() => setFailedSrc(src)} />;
}
