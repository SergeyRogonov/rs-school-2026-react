export default function About() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">About the App</h2>
        <p className="mb-4">
          This Pokémon Search App allows users to search for Pokémon by name or
          ID, view detailed information about each Pokémon, and browse through
          the complete Pokémon database with pagination.
        </p>
        <p className="mb-4">
          The app uses the PokeAPI GraphQL endpoint to fetch Pokémon data and
          provides a responsive user interface built with React and Tailwind
          CSS.
        </p>
      </div>
    </div>
  );
}
