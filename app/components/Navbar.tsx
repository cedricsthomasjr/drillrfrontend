"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="w-full bg-[#1A1A1A] border-b border-[#2A2A2C] fixed top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-extrabold tracking-tight text-white hover:text-[#6366F1] transition"
        >
          Drilr
          <span className="text-2xl font-extrabold text-indigo-400">.</span>
        </Link>

        <nav className="space-x-6 text-sm font-medium text-gray-400">
          <Link
            href="/"
            className="hover:text-white transition-colors duration-200"
          >
            Home
          </Link>
          <Link
            href="/quiz"
            className="hover:text-white transition-colors duration-200"
          >
            Quiz
          </Link>
          <Link
            href="/sets"
            className="hover:text-white transition-colors duration-200"
          >
            My Sets
          </Link>
          <Link
            href="/settings"
            className="hover:text-white transition-colors duration-200"
          >
            Settings
          </Link>
        </nav>
      </div>
    </header>
  );
}
