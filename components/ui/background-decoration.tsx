// components/ui/background-decoration.tsx
import Image from "next/image";

// Fixed import path using the correct alias configuration
import BGImage from "@/assets/background1.png";

export function BackgroundDecoration() {
  return (
    <>
      {/* Background decorative elements */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <Image
          src={BGImage}
          alt='Background decoration'
          width={1000}
          height={1000}
          // className="ojbject-cover w-full h-full"
          className='absolute top-0 left-0 w-full h-full object-cover'
          priority // Add priority to ensure faster loading for important background
        />
      </div>
    </>
  );
}
