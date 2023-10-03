"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FocusLock from "react-focus-lock";
import { RemoveScroll } from "react-remove-scroll";

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return (
    <FocusLock>
      <RemoveScroll>
        <div className="fixed inset-0 flex justify-end bg-black/40 z-20">
          <div className="bg-white w-screen max-w-lg shadow-lg max-h-screen overflow-y-scroll">
            <div className="flex flex-row justify-end w-full">
              <button
                onClick={() => router.back()}
                className="p-1 m-2 rounded-md ring-inset focus:ring-blue-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-7 h-7"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>

                <span className="sr-only">Close Modal</span>
              </button>
            </div>
            <div className="p-6 pt-0">{children}</div>
          </div>
        </div>
      </RemoveScroll>
    </FocusLock>
  );
}
