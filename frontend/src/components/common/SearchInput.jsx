import React from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchInput = ({ value, onChange, placeholder = 'Search...' }) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FaSearch className="text-gray-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10 pr-4 py-2 border border-border-light dark:border-border-dark rounded-md bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:outline-none focus:ring-1 focus:ring-primary-light dark:focus:ring-primary-dark"
      />
    </div>
  );
};

export default SearchInput;