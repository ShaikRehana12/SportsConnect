function TournamentCard({ title, sport, location, date }) {
  return (
    <div className="bg-white border border-primary rounded-xl shadow-md p-6 hover:shadow-xl transition">

      <h3 className="text-xl font-semibold text-primary mb-2">
        {title}
      </h3>

      <p className="text-gray-600">Sport: {sport}</p>
      <p className="text-gray-600">Location: {location}</p>
      <p className="text-gray-600 mb-4">Date: {date}</p>

      <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-cyan-700">
        Register
      </button>

    </div>
  );
}

export default TournamentCard;