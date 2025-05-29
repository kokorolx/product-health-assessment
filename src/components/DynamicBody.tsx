'use client'

interface DynamicBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function DynamicBody({ children, className }: DynamicBodyProps) {
  return (
    <body className={className} suppressHydrationWarning>
      {children}
    </body>
  );
}