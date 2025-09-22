import { useState, useRef , useEffect} from "react";
import { Plus } from "lucide-react";

const Chatbot = () => {
  const [sessionFile, setSessionFile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [sessions, setSessions] = useState([]);
  const userInput = useRef(null);
  const chatBoxRef = useRef(null);
  const hasInitialized = useRef(false);
  const [loadingBot, setLoadingBot] = useState(false);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackProvider, setFeedbackProvider] = useState("");

  const updatePhrases = [
  "update your lesson plan",
  "update the lesson plan",
  "updating your lesson plan"
];

  const initializeChat = async () => {
    const formData = new FormData();
    
    try {
      const res = await fetch("http://localhost:8000/chatStart", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.session_id) {
        setSessionId(data.session_id);
      }
      appendMessage("bot", data.response);
    } catch (err) {
      appendMessage("bot", "Error initializing chatbot.");
    }
  };

  const fetchSessions = async () => {
    try {
      setLoadingSessions(true);
      const res = await fetch("http://localhost:8000/sessions");
      const data = await res.json();
      setSessions(data);
      setLoadingSessions(false);
    } catch (err) {
      console.error("Failed to fetch sessions", err);
      setLoadingSessions(false);
    }
  };

  const fetchMessages = async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/sessionMessages?session_id=${id}`);
      const data = await res.json();
      // Format messages to your frontend style
      const formatted = data.messages.map(m => ({
        sender: m.role === "user" ? "user" : "bot",
        text: m.content,
      }));
      setMessages(formatted);
      setSessionId(id);
      setSessionFile(data.file)
    } catch (err) {
      console.error("Failed to fetch session messages", err);
    }
  };


  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    
    fetchSessions()
    initializeChat(); // Initial session creation on page load
  }, []);


  const appendMessage = (sender, text) => {
    setMessages((prev) => [...prev, { sender, text }]);
    setTimeout(() => {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }, 100);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    if (file) {
      setSessionFile(file); // Store for formData use
      appendMessage("user", `📎 Uploaded file: ${file.name}`);
      formData.append("file", file);
    }
    if (sessionId) {
      formData.append("session_id", sessionId);
    } 

    try {
    setLoadingBot(true);
    const endpoint = "http://localhost:8000/fileUpload";

    const res = await fetch(endpoint, {
      method: "POST",
      body: formData,
    });
      const data = await res.json();
      appendMessage("bot", data.response);
      setLoadingBot(false);
      fetchSessions();
    } catch (err) {
      appendMessage("bot", "Error: Could not connect to chatbot API.");
      setLoadingBot(false);
    }  

  };

  const handleSend = async () => {
    const input = userInput.current.value.trim();
    if (!input) return;

    appendMessage("user", input);
    userInput.current.value = "";

    const formData = new FormData();
    formData.append("message", input);
    
    // If sessionId exists, it's a follow-up message
    if (sessionId) {
      formData.append("session_id", sessionId);
    } 
    if (!sessionFile) {
        appendMessage("bot", "Please upload a lesson plan file before starting.");
        return;
    } 
    

    try {
    setLoadingBot(true);
    const endpoint = "http://localhost:8000/chatContinue";

    const res = await fetch(endpoint, {
      method: "POST",
      body: formData,
    });
      const data = await res.json();
      appendMessage("bot", data.response);
      setLoadingBot(false);
    } catch (err) {
      appendMessage("bot", "Error: Could not connect to chatbot API.");
      setLoadingBot(false);
    }  
  };

  const handleUpdateLesson = async () => {
    const lastBotMsg = messages.filter(m => m.sender === "bot").pop()?.text;
    if (!lastBotMsg || !sessionId) return;

    const formData = new FormData();
    formData.append("session_id", sessionId);
    formData.append("new_content", lastBotMsg);

    try {
        setLoadingBot(true);
        const res = await fetch("http://localhost:8000/updateLesson", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      appendMessage("bot", data.response);
      setLoadingBot(false);
    } catch (err) {
      appendMessage("bot", "Error: Could not connect to chatbot API.");
      setLoadingBot(false);
    } 
  };

  const handleNewChat = () => {
    setMessages([])
    setSessionFile(null);
    setSessionId(null);
    if (userInput.current) userInput.current.value = "";
    initializeChat();
  };

  const handleSendFeedack = () => {
    setShowFeedbackPopup(true);
  };

  const submitFeedback = async () => {
  if (!feedbackText.trim()) return;

  const formData = new FormData();
  formData.append("session_id", sessionId);
  formData.append("feedback", feedbackText);
  formData.append("feedbackProvider", feedbackProvider);

  try {
    const res = await fetch("http://localhost:8000/submitFeedback", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    alert("🙏 Thank you for your feedback!");
    setShowFeedbackPopup(false);
    setFeedbackText("");
    setFeedbackProvider("")
  } catch (err) {
    alert("⚠️ Failed to submit feedback.");
  }
};

return (
    <div className="w-screen h-screen flex flex-col md:flex-row">
      {/* History Column */}
      <div className="w-full md:w-1/5 bg-gray-100 p-4 border-b md:border-b-0 md:border-r overflow-y-auto">
        <button
          onClick={handleNewChat}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          New Chat
        </button>
        <br /><br />
        <h2 className="text-lg font-semibold mb-4">Chat History</h2>
        {loadingSessions ? (
          <div className="text-gray-500 text-sm animate-pulse">Loading sessions...</div>
        ) : (
          <ul className="space-y-2">
            {sessions.length === 0 && <li>No sessions yet</li>}
            {sessions.map((sess, idx) => (
              <li
                key={sess.id}
                onClick={() => fetchMessages(sess.id)}
                className={`p-2 rounded cursor-pointer hover:bg-gray-200 ${
                  sess.id === sessionId ? "bg-blue-300 font-bold" : "bg-white"
                }`}
              >
                Session {idx + 1} <br />
                <small>{new Date(sess.created_at).toLocaleString()}</small>
                <br />
                <small className="italic text-xs">
                  {sess.lesson_preview || sess.summary || "No preview"}
                </small>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Chat Column */}
      <div className="w-full md:w-4/5 flex flex-col p-4">
        <div className="mb-4 text-center">
          <p className="text-xl font-semibold text-gray-800">Welcome to GenEDIt</p>
        </div>

        <div
          ref={chatBoxRef}
          className="flex-1 overflow-y-auto bg-white rounded p-4 mb-4"
        >
          {messages.map((msg, idx) => {
            const isLastBotMessage = msg.sender === "bot" && idx === messages.length - 1;
            const showUpdateButton = isLastBotMessage && updatePhrases.some(phrase =>
              msg.text.toLowerCase().includes(phrase)
            );
            const showDownloadButton = isLastBotMessage && msg.text.toLowerCase().includes("updated lesson plan");

            return (
              <div key={idx} className="mb-2">
                <div className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`px-4 py-2 rounded-lg max-w-[80%] text-sm whitespace-pre-wrap ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>

                {showUpdateButton && (
                  <div className="flex justify-end mt-1">
                    <button
                      onClick={handleUpdateLesson}
                      className="bg-green-500 text-white px-3 py-1 text-xs rounded hover:bg-green-600 shadow-md"
                    >
                      ✅ Update Lesson Plan
                    </button>
                  </div>
                )}

                {showDownloadButton && (
                  <div>
                    <div className="flex justify-end items-center mt-1 space-x-2">
                      <a
                        href={`http://localhost:8000/downloadLesson?session_id=${sessionId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-purple-600 text-white px-3 py-1 text-xs rounded hover:bg-purple-700 shadow-md"
                      >
                        📥 Download .docx
                      </a>
                    </div>
                    <div className="w-full flex justify-center mt-2">
                      <p className="text-sm text-gray-600 italic">
                        Is there anything else I can assist you with?
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {loadingBot && (
            <div className="flex justify-start mb-2">
              <div className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 text-sm animate-pulse">
                ✨ Thinking...
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="flex items-center gap-2">
          <label className="cursor-pointer relative">
            <Plus className="w-6 h-6 text-gray-600" />
            <input
              type="file"
              accept=".pdf,.docx"
              className="absolute inset-0 opacity-0"
              onChange={handleFileChange}
            />
          </label>

          <input
            type="text"
            placeholder="Type your message..."
            ref={userInput}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Send
          </button>
          <button
            onClick={() => setShowFeedbackPopup(true)}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
          >
            Send Feedback
          </button>
        </div>
      </div>

      {/* Feedback Popup */}
      {showFeedbackPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
    <div className="bg-white p-8 rounded-xl shadow-xl w-[600px] max-w-full">
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
        Send Feedback
      </h2>
      <input
            type="text"
            placeholder="Your name"
            value={feedbackProvider}
            onChange={(e) => setFeedbackProvider(e.target.value)}
            className="flex-1 border border-gray-300 rounded-md px-3 py-2"
      />
      <br/><br/>
      <textarea
        className="w-full h-48 border border-gray-300 rounded-lg p-4 text-base"
        value={feedbackText}
        onChange={(e) => setFeedbackText(e.target.value)}
        placeholder="Your feedback..."
      />
      <div className="flex justify-end space-x-3 mt-4">
        <button
          onClick={() => setShowFeedbackPopup(false)}
          className="px-5 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
        >
          Cancel
        </button>
        <button
          onClick={submitFeedback}
          className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  </div>
  )}
  </div>
  );
};

export default Chatbot;

