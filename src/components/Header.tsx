interface HeaderProps {
  onUploadClick?: () => void;
  showTelegramButton?: boolean;
}

const Header = ({ onUploadClick, showTelegramButton }: HeaderProps) => {
  return (
    <header className="bg-gray-100 px-6 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Product Health Assessment
        </h1>
        {onUploadClick && (
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
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
            className="inline-flex items-center px-8 py-4 text-lg font-medium text-white bg-[#0088cc] rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.2-.04-.28-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.37-.49 1.02-.75 3.98-1.73 6.64-2.87 7.97-3.43 3.78-1.58 4.57-1.85 5.08-1.86.11 0 .37.03.54.18.17.15.21.35.23.47-.01.06.01.24-.01.38z"/>
            </svg>
            Try it now
          </a>
        )}
      </div>
    </header>
  );
};

export default Header;
