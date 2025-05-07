import Link from "next/link";
export const metadata = {
  title:
    "Internal dialogue: Your AI-Powered internal dialogue and avatar management for Efficient Communication",
  description:
    "Internal dialogue is your AI-powered ai assistant that streamlines communication, organizes your stress, and boosts productivity!",
  keywords:
    "AI Avatar assistant, Internal dialogue, mental health management, productivity, communication",
  robots: "index, follow",
  openGraph: {
    title: "Internal dialogue: Your AI-Powered Ai with Avatar Assistant",
    description:
      "Streamline your communication with Internal dialogue, the AI assistant that organizes your communication and enhances productivity.",
    url: process.env.NEXT_PUBLIC_BASE_URL,
    width: 1000,
    height: 600,
    type: "website",
    images: "https://i.postimg.cc/d1mw0tv9/logo-1.png",
  },
};
const RootNotFound = () => {
  return (
    <div className=" w-full px-16 md:px-0 h-screen flex items-center justify-center">
      <div className="bg-white border border-gray-200 flex flex-col items-center justify-center px-4 md:px-8 lg:px-24 py-8 rounded-lg shadow-2xl">
        <p className="text-6xl md:text-7xl lg:text-9xl font-bold tracking-wider text-gray-300">
          404
        </p>
        <p className="text-2xl md:text-3xl lg:text-5xl font-bold tracking-wider text-gray-500 mt-4">
          Page not found!
        </p>
        <p className="text-gray-600 mt-4 pb-4 border-b-2 text-center">
          But dont worry, you can find plenty of other things on our homepage.
        </p>
        <Link
          href="/"
          className="flex items-center space-x-2 border border-primary bg-primary hover:bg-white hover:text-primary hover:border hover:border-primary text-gray-100 px-4 py-2 mt-6 rounded transition duration-150"
          title="Return Home"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
};

export default RootNotFound;
