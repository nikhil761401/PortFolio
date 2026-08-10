import { ReactNode } from "react";

export default function Container({
  children,
  className = "",
  wide = false,
}: {
  children: ReactNode;
  className?: string;
  /**
   * Widens the container from max-w-5xl (1024px) to max-w-[90rem] (1440px)
   * for sections that should feel like a major, full-width part of the page
   * rather than sitting in the standard reading column.
   */
  wide?: boolean;
}) {
  return (
    <div
      className={`mx-auto w-full px-6 ${
        wide ? "max-w-[90rem] lg:px-20" : "max-w-5xl"
      } ${className}`}
    >
      {children}
    </div>
  );
}
