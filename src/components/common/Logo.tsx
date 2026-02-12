import type { SVGProps } from 'react';

interface LogoProps extends SVGProps<SVGSVGElement> {
  color?: string;
}

export function Logo({ color = 'currentColor', ...props }: LogoProps) {
  return (
    <svg width="160" height="50" viewBox="4 20 250 65" xmlns="http://www.w3.org/2000/svg" {...props}>
      <text xmlSpace="preserve" x="8" y="75" fontFamily="Graffiti" fontSize="52" fill={color}>
        EchoBay
      </text>
    </svg>
  );
}
