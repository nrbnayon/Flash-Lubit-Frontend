// components/ui/background-decoration.tsx
import Image from "next/image";
import BGImage from "@/assets/avateruploadBG.png";

export function BackgroundDecoration() {
  return (
    <>
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Image
          src={BGImage}
          alt="Background decoration"
          width={1920}
          height={1080}
          className="absolute top-0 left-0 w-full h-full object-cover"
          priority
        />
      </div>
    </>
  );
}
