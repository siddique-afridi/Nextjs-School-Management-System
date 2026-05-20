import React from 'react'

const ErrorHandler = ({error}) => {

 if (error)
    return (
      <div className="flex flex-col items-center justify-center mt-16 text-center px-4">
        <h2 className="text-red-600 font-semibold text-xl mb-2">
          Server Unavailable
        </h2>
        <p className="text-gray-600 mb-4">
          {error || "Our server is currently unavailable. Please try again later."}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Retry
        </button>
      </div>
    );
}

export default ErrorHandler