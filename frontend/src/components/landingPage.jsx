import { useNavigate } from "react-router-dom";

//Landing page for future development. Do not use at the moment
const LandingPage = () => {
  const navigate = useNavigate();

  const handleClick = (option) => {
    navigate("/chat", { state: { mode: option } });
  };

  return (
    <div className="min-h-screen w-screen flex flex-col justify-center items-center bg-gradient-to-b from-white to-gray-100 text-center px-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">
        Welcome to EDI Integration Assistant
      </h1>
    <br/><br/>
      <h3 className="text-xl text-gray-600 mb-10">
        Which assistant experience are you looking for?
      </h3>

      <div className="flex flex-col sm:flex-row gap-6">
        <button
          onClick={() => handleClick("option1")}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
        >
          Assitant for Beginners
        </button>
        <button
          onClick={() => handleClick("option2")}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
        >
          Assitant for Experts
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
