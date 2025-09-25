import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="relative text-gray-300 pt-24 pb-8 overflow-hidden">
      {/* Degradado superior para transición sutil */}
      <div className=""></div>
      {/* Contenido */}
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 text-center md:text-left">
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold text-white">TaskFlow</h2>
            <p className="mt-4 text-sm text-gray-400 leading-relaxed max-w-xs mx-auto md:mx-0">
              Built for students and teams who want to collaborate smarter, stay
              organized, and achieve goals together.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold mb-4">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/about" className="hover:text-purple-400 transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="/blog" className="hover:text-purple-400 transition">
                  Blog
                </a>
              </li>
              <li>
                <a href="/support" className="hover:text-purple-400 transition">
                  Support
                </a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-purple-400 transition">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-white font-semibold mb-4">Connect</h3>
            <div className="flex justify-center md:justify-start gap-6 text-xl">
              <a
                href="https://github.com"
                target="_blank"
                className="hover:text-purple-400 transition"
              >
                <FaGithub />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                className="hover:text-purple-400 transition"
              >
                <FaLinkedin />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                className="hover:text-purple-400 transition"
              >
                <FaTwitter />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700/50 pt-6 text-center">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} TaskFlow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
