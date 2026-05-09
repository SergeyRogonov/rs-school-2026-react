import React from 'react';

interface SearchProps {
  onSearch: (query: string) => void;
}

interface SearchState {
  query: string;
}

class Search extends React.Component<SearchProps, SearchState> {
  constructor(props: SearchProps) {
    super(props);
    this.state = { query: '' };
  }

  componentDidMount() {
    const lastSearch = localStorage.getItem('lastSearchTerm');
    if (lastSearch) {
      this.setState({ query: lastSearch });
    }
  }

  handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    const trimmedQuery = this.state.query.trim();
    const lastSearch = localStorage.getItem('lastSearchTerm');

    this.setState({ query: trimmedQuery });

    if (trimmedQuery !== lastSearch) {
      localStorage.setItem('lastSearchTerm', trimmedQuery);
    }

    this.props.onSearch(trimmedQuery);
  };

  render() {
    return (
      <div>
        <form
          className="flex flex-col justify-center gap-2 sm:flex-row sm:gap-4 w-full px-4 sm:px-6"
          onSubmit={this.handleSubmit}
        >
          <input
            className="flex-1 px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base border rounded max-w-xl"
            placeholder="Search by name or ID"
            value={this.state.query}
            onChange={(e) => this.setState({ query: e.target.value })}
          ></input>
          <button
            className="px-4 py-2 sm:px-6 sm:py-2 text-sm sm:text-base bg-blue-500 text-white rounded hover:bg-blue-600"
            type="submit"
          >
            Search
          </button>
        </form>
      </div>
    );
  }
}

export default Search;
