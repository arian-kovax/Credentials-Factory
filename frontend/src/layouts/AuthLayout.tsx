import { ReactNode } from "react";
import college from "../assets/college.jpg";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen w-full flex-col overflow-hidden lg:flex-row">
        <div className="h-56 w-full lg:h-auto lg:w-1/2">
          <img
            src={college}
            alt="College"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex w-full flex-1 items-center justify-center px-6 py-10 sm:px-8 lg:w-1/2">
          <div className="w-full max-w-form rounded-card bg-white p-8 shadow-sm sm:p-10">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
