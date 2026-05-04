import React from 'react';

class TestErrorButton extends React.Component {
  state = { shouldThrow: false };

  handleTestError = () => {
    this.setState({ shouldThrow: true });
  };

  render() {
    if (this.state.shouldThrow) {
      throw new Error('Test error triggered by user');
    }

    return (
      <button
        onClick={this.handleTestError}
        className="px-0 py-0 sm:px-3 sm:py-1 text-sm sm:text-sm bg-red-500 text-white rounded hover:bg-red-600 w-12 sm:w-auto whitespace-pre-line sm:whitespace-normal"
      >
        Throw Error
      </button>
    );
  }
}

export default TestErrorButton;
