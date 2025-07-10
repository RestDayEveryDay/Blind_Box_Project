const SearchBar = ({ value, onChange }) => (
  <div className="sticky top-0 bg-white z-10 py-2 px-4 shadow-sm">
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder="搜索盲盒池..."
      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  </div>
);

export default SearchBar;
