import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CarFront } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md text-center space-y-4">
        <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-indigo-100 text-indigo-600 font-bold text-2xl">
          404
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Page Not Found
        </h1>
        <p className="text-sm text-slate-500">
          The fleet route you are looking for does not exist or has been relocated.
        </p>
        <div className="pt-2">
          <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
            <Link to="/dashboard">
              <ArrowLeft className="mr-1.5 size-4" /> Return to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
