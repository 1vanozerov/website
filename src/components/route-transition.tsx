"use client";

import {
  createContext,
  type MouseEvent,
  type ReactNode,
  useCallback,
  useContext,
} from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Navigate = (destination: string) => void;
const Navigation = createContext<Navigate | null>(null);

export function RouteTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const go = useCallback((destination: string) => router.push(destination), [router]);
  return <Navigation.Provider value={go}>{children}</Navigation.Provider>;
}

export function SceneLink({
  href,
  children,
  className,
  "aria-current": ariaCurrent,
  onPointerMove,
  onPointerLeave,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  "aria-current"?: "page" | undefined;
  onPointerMove?: React.PointerEventHandler<HTMLAnchorElement>;
  onPointerLeave?: React.PointerEventHandler<HTMLAnchorElement>;
}) {
  const go = useContext(Navigation);

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.currentTarget.hasAttribute("download")
    ) return;

    const target = new URL(event.currentTarget.href);
    if (target.origin !== window.location.origin) return;
    const current = new URL(window.location.href);
    if (target.pathname === current.pathname) {
      // Normal browser behavior for current-page anchors.
      return;
    }
    if (!go) return;
    event.preventDefault();
    go(href);
  }

  return (
    <Link href={href} className={className} aria-current={ariaCurrent} onClick={handleClick} onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
      {children}
    </Link>
  );
}
