export default function ReactHookForm() {
  return (
    <form className="max-w-lg min-w-md mx-auto p-6 bg-white rounded shadow ">
      <h2 className="text-xl font-semibold mb-4">React Hook Form</h2>

      <label htmlFor="firstname" className="block mb-3">
        <span className="font-medium">First Name:</span>
        <input
          type="text"
          name="firstname"
          id="firstname"
          placeholder="Enter First Name"
          required
          className="block w-full mt-1 px-1 py-1 rounded shadow-sm"
        />
      </label>

      <label htmlFor="lastname" className="block mb-3">
        <span>Last name:</span>
        <input
          name="lastname"
          id="lastname"
          placeholder="Enter Last Name"
          required
          className="block w-full mt-1 px-1 py-1 rounded shadow-sm"
        />
      </label>

      <label htmlFor="age" className="block mb-3">
        <span className="font-medium">Age</span>
        <input
          name="age"
          id="age"
          type="number"
          min="0"
          placeholder="Age"
          required
          className="block w-full mt-1 px-1 py-1 rounded shadow-sm"
        />
      </label>

      <label htmlFor="email" className="block mb-3">
        <span className="font-medium">Email:</span>
        <input
          name="email"
          id="email"
          type="email"
          placeholder="react@example.com"
          required
          className="block w-full mt-1 px-1 py-1 rounded shadow-sm"
        />
      </label>

      <fieldset className="mb-3">
        <legend className="font-medium mb-2">Gender</legend>

        <div className="flex gap-3">
          <label htmlFor="male" className="inline-flex items-center space-x-2">
            <input
              type="radio"
              name="gender"
              id="male"
              value="male"
              className="h-4 w-4"
            />
            <span className="text-sm">Male</span>
          </label>

          <label
            htmlFor="female"
            className="inline-flex items-center space-x-2"
          >
            <input
              type="radio"
              name="gender"
              id="female"
              value="female"
              className="h-4 w-4"
            />
            <span className="text-sm">Female</span>
          </label>

          <label htmlFor="other" className="inline-flex items-center space-x-2">
            <input
              type="radio"
              name="gender"
              id="other"
              value="other"
              className="h-4 w-4"
            />
            <span className="text-sm">Other</span>
          </label>
        </div>
      </fieldset>

      <label htmlFor="password" className="block mb-3">
        <span className="font-medium">Password</span>
        <input
          name="password"
          id="password"
          type="password"
          placeholder="********"
          required
          className="block w-full mt-1 px-1 py-1 rounded shadow-sm"
        />
      </label>

      <label htmlFor="avatar" className="block mb-3">
        <span className="font-medium">Upload avatar</span>
        <input
          name="avatar"
          id="avatar"
          type="file"
          accept="image/*"
          className="block mt-1 px-1 py-1 w-full cursor-pointer rounded-md  border-gray-300 bg-white shadow-sm text-gray-700"
        />
      </label>

      <label htmlFor="acceptTos" className="flex items-center mb-4">
        <input
          name="acceptTos"
          id="acceptTos"
          type="checkbox"
          required
          className="h-4 w-4"
        />
        <span className="ml-2 text-sm">I accept the Terms and Conditions</span>
      </label>

      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Create account
      </button>
    </form>
  );
}
