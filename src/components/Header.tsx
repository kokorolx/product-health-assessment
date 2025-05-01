interface HeaderProps {
  onUploadClick: () => void;
}

const Header = ({ onUploadClick }: HeaderProps) => {
  return (
    <header className="bg-gray-100 px-6 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Product Health Assessment
        </h1>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          aria-label="Upload Image"
          onClick={onUploadClick}
        >
          Upload Image
        </button>
      </div>
    </header>
  );
};

export default Header;