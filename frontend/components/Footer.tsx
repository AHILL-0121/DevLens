import { Github, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative z-10 mt-16 border-t border-gray-200/50">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <Github className="w-5 h-5 text-gray-600" />
            <span className="text-gray-700 font-semibold">DevLens</span>
            <span className="text-gray-500 text-sm">AI-Powered GitHub Profile Analyzer</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm">
            <a
              href="https://github.com/AHILL-0121"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>Contributions</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            
            <a
              href="https://sa-portfolio-psi.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Portfolio</span>
            </a>
          </div>

          {/* Copyright */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>© {new Date().getFullYear()} DevLens</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
