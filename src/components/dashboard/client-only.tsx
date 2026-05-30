'use client';

import * as React from 'react';

export default function ClientOnly({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = React.useState(false);

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    // Render a clean dark loading container matching the dashboard background
    // to prevent any visual flicker during hydration.
    return <div className="min-h-screen bg-zinc-950" />;
  }

  return <>{children}</>;
}
