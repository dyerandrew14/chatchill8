import { useEffect } from "react";
import { CameraTest } from "@/components/camera-test";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Head from "next/head";

export default function Home() {
  useEffect(() => {
    document.body.classList.add("bg-black", "text-white");
    return () => {
      document.body.classList.remove("bg-black", "text-white");
    };
  }, []);

  return (
    <>
      <Head>
        <title>Camera Troubleshooting</title>
      </Head>

      <div className="min-h-screen">
        <header className="p-4 border-b border-gray-800">
          <Link href="/" className="flex items-center gap-2 text-gray-300 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Chat</span>
          </Link>
        </header>

        <main className="container mx-auto py-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Camera Troubleshooting</h1>

            <div className="bg-gray-900 rounded-lg p-6 mb-8">
              <CameraTest />
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold">Common Camera Issues</h2>

              <div className="space-y-2">
                <h3 className="font-bold">Browser Permissions</h3>
                <p>Make sure you've allowed camera access in your browser. Look for the camera icon in your address bar.</p>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold">Hardware Issues</h3>
                <p>Ensure your camera is properly connected and not being used by another application.</p>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold">Browser Compatibility</h3>
                <p>Try using a different browser like Chrome, Firefox, or Edge.</p>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold">Device Settings</h3>
                <p>Check your device's privacy settings to ensure browser access to your camera is enabled.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
