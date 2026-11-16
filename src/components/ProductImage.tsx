"use client";
import { useState } from "react";

type Props = {
  src?: string | null;
  alt: string;
  kategori?: string;
  className?: string;
};

const PALETTE: Record<string, { bg: string; fg: string; icon: string }> = {
  Makanan: { bg: "#271e12", fg: "#d4a574", icon: "🍲" },
  Aksesoris: { bg: "#0f2926", fg: "#2dd4bf", icon: "🎀" },
  Perawatan: { bg: "#171c36", fg: "#818cf8", icon: "🧴" },
  Mainan: { bg: "#2c1322", fg: "#f472b6", icon: "🧶" },
  Kandang: { bg: "#182032", fg: "#94a3b8", icon: "🏠" },
};

function placeholderDataUri(kategori = "Lainnya", nama = "") {
  const theme = PALETTE[kategori] ?? { bg: "#2a1c14", fg: "#d4a574", icon: "🐾" };
  const label = (nama || kategori).slice(0, 24);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="${theme.bg}"/><circle cx="400" cy="220" r="92" fill="#ffffff" opacity="0.06"/><text x="400" y="250" font-size="88" text-anchor="middle">${theme.icon}</text><text x="400" y="380" font-family="sans-serif" font-size="26" font-weight="700" fill="${theme.fg}" text-anchor="middle">${kategori.toUpperCase()}</text><text x="400" y="424" font-family="sans-serif" font-size="22" fill="${theme.fg}" opacity="0.8" text-anchor="middle">${label}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export default function ProductImage({ src, alt, kategori = "Lainnya", className = "w-full h-full object-cover" }: Props) {
  const [failed, setFailed] = useState(false);
  const usePlaceholder = failed || !src || !src.trim();
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={usePlaceholder ? placeholderDataUri(kategori, alt) : src!}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
