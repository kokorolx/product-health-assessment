const ProductCardSkeleton = () => {
  return (
    <div className="relative rounded-lg shadow-lg overflow-hidden animate-pulse aspect-[3/2] bg-slate-700"> {/* Darker placeholder for dark bg */}
      {/* The skeleton will just be a colored box with the correct aspect ratio,
          as the content is primarily the image and hover-reveal info.
          No need to show skeleton text elements if they are hidden by default. */}
    </div>
  );
};

export default ProductCardSkeleton;
