export default function Footer() {
  return (
    <footer className="w-full bg-[#1A1A1A] border-t border-[#2A2A2C] text-sm text-gray-500 dark:text-gray-400">
      <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-center md:text-left">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-white">Drilr</span>. All rights
          reserved.
        </p>
        <div className="flex space-x-6 text-sm">
          <a
            href="#"
            className="hover:text-white transition-colors duration-200"
          >
            Privacy
          </a>
          <a
            href="#"
            className="hover:text-white transition-colors duration-200"
          >
            Terms
          </a>
          <a
            href="#"
            className="hover:text-white transition-colors duration-200"
          >
            Support
          </a>
        </div>
      </div>
    </footer>
  );
}
