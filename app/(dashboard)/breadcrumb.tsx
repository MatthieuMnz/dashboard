'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';

// Map route segments to display labels
const routeLabels: Record<string, string> = {
  '': 'Dashboard',
  customers: 'Customers',
  users: 'Users',
  orders: 'Orders',
  analytics: 'Analytics'
};

// Capitalize first letter and replace hyphens with spaces
function formatSegment(segment: string): string {
  return routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
}

export function DynamicBreadcrumb() {
  const pathname = usePathname();
  
  // Remove leading slash and split into segments
  const segments = pathname.split('/').filter(Boolean);
  
  // Build breadcrumb items
  const items = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/');
    const label = formatSegment(segment);
    const isLast = index === segments.length - 1;
    
    return { href, label, isLast };
  });
  
  // Always start with Dashboard link
  const breadcrumbItems = [
    <BreadcrumbItem key="dashboard">
      <BreadcrumbLink asChild>
        <Link href="/">Dashboard</Link>
      </BreadcrumbLink>
    </BreadcrumbItem>
  ];
  
  // Add segments with separators
  items.forEach((item) => {
    breadcrumbItems.push(
      <BreadcrumbSeparator key={`sep-${item.href}`} />,
      <BreadcrumbItem key={item.href}>
        {item.isLast ? (
          <BreadcrumbPage>{item.label}</BreadcrumbPage>
        ) : (
          <BreadcrumbLink asChild>
            <Link href={item.href}>{item.label}</Link>
          </BreadcrumbLink>
        )}
      </BreadcrumbItem>
    );
  });
  
  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>{breadcrumbItems}</BreadcrumbList>
    </Breadcrumb>
  );
}

