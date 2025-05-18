import Image from 'next/image';
import Link from 'next/link';

interface HeaderProps {
  onUploadClick?: () => void;
  showTelegramButton?: boolean;
}

const Header = ({ onUploadClick, showTelegramButton }: HeaderProps) => {
  return (
    <header className="bg-white px-6 shadow-md sticky top-0 z-50 h-16 flex items-center"> {/* Explicit h-16, flex items-center for vertical alignment */}
      <div className="max-w-7xl mx-auto flex justify-between items-center w-full"> {/* w-full for inner container */}
        <div className="flex items-center gap-3"> {/* Container for logo and title */}
          <Link href="/" legacyBehavior>
            <a aria-label="Go to homepage">
              <Image
                src="/logo.png" // Path relative to /public
                alt="Site Logo"
                width={40} // Adjust width as needed, maintaining aspect ratio
                height={40} // Adjust height as needed, maintaining aspect ratio
                className="h-10 w-10" // Tailwind classes for size, ensure h-16 on header is respected
              />
            </a>
          </Link>
          <Link href="/" legacyBehavior>
            <a className="text-2xl font-bold text-slate-800 hover:text-blue-600 transition-colors">
              Product Health Assessment
            </a>
          </Link>
        </div>
        <div className="flex items-center gap-4"> {/* Container for buttons */}
          {onUploadClick && (
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors" // Slightly darker blue
            aria-label="Upload Image"
            onClick={onUploadClick}
          >
            Upload Image
          </button>
        )}
        {showTelegramButton && (
          <a
            href="https://t.me/sudo2025mediabot"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 min-h-[40px] text-lg font-medium text-white bg-[#0088cc] rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg" // Kept Telegram brand color
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 w-7 h-7 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.2-.04-.28-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.37-.49 1.02-.75 3.98-1.73 6.64-2.87 7.97-3.43 3.78-1.58 4.57-1.85 5.08-1.86.11 0 .37.03.54.18.17.15.21.35.23.47-.01.06.01.24-.01.38z"/>
            </svg>
            <span className="whitespace-nowrap">Try now</span>
          </a>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
