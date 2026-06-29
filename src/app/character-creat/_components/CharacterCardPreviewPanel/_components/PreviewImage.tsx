import Image from "next/image";

interface PreviewImageProps {
  image: string;
  title: string;
}

const CHECKERBOARD_STYLE = {
  backgroundColor: "#f4f4f4",
  backgroundImage:
    "linear-gradient(45deg, #e8e8e8 25%, transparent 25%), linear-gradient(-45deg, #e8e8e8 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e8e8e8 75%), linear-gradient(-45deg, transparent 75%, #e8e8e8 75%)",
  backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0",
  backgroundSize: "16px 16px",
};

const PreviewImage = ({ image, title }: PreviewImageProps) => {
  if (!image) {
    return <div className="absolute inset-0" style={CHECKERBOARD_STYLE} />;
  }

  return (
    <Image
      src={image}
      alt={title}
      fill
      sizes="227px"
      unoptimized
      className="object-cover"
    />
  );
};

export default PreviewImage;
