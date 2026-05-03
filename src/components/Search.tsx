import React from 'react';

class Search extends React.Component {
  render() {
    return (
      <div>
        <form className="flex flex-col justify-center gap-2 sm:flex-row sm:gap-4 w-full px-4 sm:px-6">
          <input className="flex-1 px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base border rounded max-w-xl"></input>
          <button className="px-4 py-2 sm:px-6 sm:py-2 text-sm sm:text-base bg-blue-500 text-white rounded hover:bg-blue-600">
            Search
          </button>
        </form>
      </div>
    );
  }
}

export default Search;
