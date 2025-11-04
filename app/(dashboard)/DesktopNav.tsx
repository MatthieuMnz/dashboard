'use client';

import Link from 'next/link';
import { Home, Settings, Users2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { VercelLogo } from '@/components/icons';
import { NavItem } from './nav-item';

export function DesktopNav() {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Link
          href="/"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <VercelLogo className="h-3 w-3 transition-all group-hover:scale-110" />
        </Link>

        <NavItem href="/" label="Tableau de bord">
          <Home className="h-5 w-5" />
        </NavItem>

        <NavItem href="/users" label="Utilisateurs">
          <Users2 className="h-5 w-5" />
        </NavItem>
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="#"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
            >
              <Settings className="h-5 w-5" />
              <span className="sr-only">Paramètres</span>
            </Link>
          </TooltipTrigger>
          {/* @ts-expect-error - type inference issue with TooltipContent */}
          <TooltipContent side="right">Paramètres</TooltipContent>
        </Tooltip>
      </nav>
    </aside>
  );
}
