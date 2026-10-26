import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "quiet" | "mark";

const variants: Record<Variant, string> = {
  primary: "bg-action text-action-foreground",
  quiet: "border border-border bg-surface text-foreground",
  mark: "bg-you text-black",
};

const base =
  "inline-flex min-h-12 items-center justify-center rounded-xl px-4 text-base font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action motion-safe:transition-transform motion-safe:duration-100 motion-safe:ease-out active:scale-[0.98]";

export function Button({
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      type={type}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    />
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  className = "",
  children,
}: {
  href: string;
  variant?: Variant;
  className?: string;
  children: ReactNode;
}) {
  const classNames = `${base} ${variants[variant]} ${className}`;
  if (href.startsWith("#")) {
    return (
      <a href={href} className={classNames}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classNames}>
      {children}
    </Link>
  );
}
