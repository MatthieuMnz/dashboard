'use client';

import { useEffect } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function SignedInToast() {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (params?.get('signedin') === '1') {
      toast.success('Welcome back!');
      // Clean the query param to avoid repeated toasts on navigation
      const next = new URLSearchParams(params.toString());
      next.delete('signedin');
      const query = next.toString();
      router.replace(query ? `${pathname}?${query}` : pathname);
    }
  }, [params, pathname, router]);

  return null;
}


