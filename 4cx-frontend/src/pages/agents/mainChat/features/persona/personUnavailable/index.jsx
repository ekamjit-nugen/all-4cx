import React from "react";
import { FileQuestion } from "lucide-react";
// import PersonaNotFoundImage from "/not-found-persona.jpg"

const PersonUnavailable = () => {
  return (
    <div className="flex items-center justify-center min-h-[300px]">
      <div className="max-w-md w-full px-6 py-8 bg-white shadow-lg rounded-lg text-center">
        {/* <FileQuestion className="mx-auto h-24 w-24 text-gray-400" /> */}
        <img className="mx-auto h-[200px] w-[200px]" src="/not-found-persona.jpg" alt="" />
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Woops!! Item not found</h2>
        <p className="mt-2 text-sm text-gray-600">
          We couldn&apos;t find the persona you&apos;re looking for. It might have been removed or
          doesn&apos;t exist.
        </p>
      </div>
    </div>
  );
};

export default PersonUnavailable;
