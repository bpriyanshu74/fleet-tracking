// import { useState } from "react";

// const SearchBar = ({ onSearch, defaultValue = "" }) => {
//   const [query, setQuery] = useState(defaultValue);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (query.trim()) onSearch(query.trim());
//   };

//   return (
//     <form onSubmit={handleSubmit} className="w-full">
//       <div className="relative w-full">
//         <input
//           type="text"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           placeholder="Search for geography (try 'Global')"
//           className="
//             w-full px-4 py-2 pr-12
//             border border-gray-300 rounded-xl
//             shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500
//             transition-all duration-200
//             text-gray-700 bg-white
//           "
//         />
//         <button
//           type="submit"
//           className="
//             absolute right-2 top-1/2 transform -translate-y-1/2
//             flex items-center justify-center
//             w-8 h-8
//             rounded-full
//             bg-sky-500 hover:bg-sky-600 text-white
//             shadow-md
//             transition-colors duration-200
//             cursor-pointer
//           "
//           aria-label="Search"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-4 w-4"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//             strokeWidth={2}
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
//             />
//           </svg>
//         </button>
//       </div>
//     </form>
//   );
// };

// export default SearchBar;

import { useState } from "react";

const SearchBar = ({ onSearch, defaultValue = "" }) => {
  const [query, setQuery] = useState(defaultValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative w-full">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search geography (try 'Global')"
          className="
            w-full
            px-3 py-2 sm:px-4 sm:py-2.5
            pr-12
            border border-gray-300 rounded-xl
            shadow-sm
            focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500
            text-gray-700 bg-white
            text-sm sm:text-base
            transition-all duration-200
          "
        />

        <button
          type="submit"
          className="
            absolute right-2 top-1/2 -translate-y-1/2
            w-8 h-8 sm:w-9 sm:h-9
            flex items-center justify-center
            rounded-full
            bg-sky-500 hover:bg-sky-600 text-white shadow
            transition
          "
          aria-label="Search"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 sm:h-5 sm:w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
            />
          </svg>
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
