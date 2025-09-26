import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="relative text-gray-300 pt-24 pb-8 overflow-hidden">
      
      <div className=""></div>
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 text-center md:text-left">
          <div>
            <h2 className="text-2xl font-bold text-white">TaskFlow</h2>
            <p className="mt-4 text-sm text-gray-400 leading-relaxed max-w-xs mx-auto md:mx-0">
              Built for students and teams who want to collaborate smarter, stay
              organized, and achieve goals together.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="hover:text-purple-400 transition hover:cursor-pointer">
                  About Us
                </span>
              </li>
              <li>
                <span className="hover:text-purple-400 transition hover:cursor-pointer">
                  Blog
                </span>
              </li>
              <li>
                <span className="hover:text-purple-400 transition hover:cursor-pointer">
                  Support
                </span>
              </li>
              <li>
                <span className="hover:text-purple-400 transition hover:cursor-pointer">
                  Privacy Policy
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Connect</h3>
            <div className="flex justify-center md:justify-start gap-6 text-xl">
              <a
                href="https://github.com/Akiii-lab/KanbanProject"
                target="_blank"
                className="hover:text-purple-400 transition"
              >
                <FaGithub />
              </a>
            </div>
          </div>
        </div>

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
