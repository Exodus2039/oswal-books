import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function Base({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function HomeIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" />
    </Base>
  );
}

export function LiveIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
      <path d="M7.5 7.5a6.5 6.5 0 0 0 0 9" />
      <path d="M16.5 7.5a6.5 6.5 0 0 1 0 9" />
    </Base>
  );
}

export function CricketIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M8 20V9M12 20V7M16 20V9" />
      <path d="M7 9h10" />
      <path d="M6.5 7.5h11" />
    </Base>
  );
}

export function P2pIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M7 7h9a2 2 0 0 1 2 2v2" />
      <path d="M16 7l-2.5-2.5M16 7l-2.5 2.5" />
      <path d="M17 17H8a2 2 0 0 1-2-2v-2" />
      <path d="M8 17l2.5 2.5M8 17l2.5-2.5" />
    </Base>
  );
}

export function ProfileIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="8" r="3" />
      <path d="M5.5 19.5a6.5 6.5 0 0 1 13 0" />
    </Base>
  );
}

export function BellIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M6 16h12l-1.2-2.2a6 6 0 0 1-.8-3V9a4 4 0 0 0-8 0v1.8a6 6 0 0 1-.8 3L6 16Z" />
      <path d="M10 16a2 2 0 0 0 4 0" />
    </Base>
  );
}
