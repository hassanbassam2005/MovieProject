import { useMovieContext } from "../context/MovieContext";
import { SearchMovies } from "../services/api";
import { useState, useEffect, useRef } from "react";

export default function Chatbot() {
  const { favorites, addTofavorite, removeFromFavorites } = useMovieContext();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Scroll to latest message
  useEffect(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  // Format movie nicely
  const formatMovie = (movie) => ({
    title: movie.title,
    overview: movie.overview || "No description available.",
    release: movie.release_date?.split("-")[0] || "N/A",
    rating: movie.vote_average || "N/A",
    runtime: movie.runtime || "N/A",
  });

  // Bot reply logic
  const generateBotReply = async (text) => {
    const lowerText = text.toLowerCase();

    // 1️⃣ Show favorites
    if (lowerText.includes("favorite") || lowerText.includes("watchlist")) {
      if (!favorites.length) return { title: "Favorites empty", overview: "You don't have any favorite movies yet." };
      return { title: "Your Favorites", overview: favorites.map(m => m.title).join(", ") };
    }

    // 2️⃣ Add/remove commands
    let action = null;
    if (lowerText.startsWith("add ")) action = "add";
    if (lowerText.startsWith("remove ")) action = "remove";

    const query = action ? text.slice(action.length).trim() : text;

    // 3️⃣ Search favorites
    let matchedMovie = favorites.find(m => m.title.toLowerCase().includes(query.toLowerCase()));

    // 4️⃣ Search TMDB
    if (!matchedMovie && query) {
      const results = await SearchMovies(query);
      if (results.length) matchedMovie = results[0];
    }

    // 5️⃣ Perform actions
    if (matchedMovie && action === "add") {
      addTofavorite(matchedMovie);
      return { title: "Added to favorites", overview: `${matchedMovie.title} has been added to your favorites.` };
    }
    if (matchedMovie && action === "remove") {
      removeFromFavorites(matchedMovie.id);
      return { title: "Removed from favorites", overview: `${matchedMovie.title} has been removed from your favorites.` };
    }

    // 6️⃣ Movie info
    if (matchedMovie) return formatMovie(matchedMovie);

    // 7️⃣ Fallback → Gemini backend
    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      return { title: "🤖 Bot Reply", overview: data.reply };
    } catch (err) {
      return { title: "Error", overview: "⚠️ Could not connect to AI server." };
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { sender: "user", text: input }]);
    const reply = await generateBotReply(input);
    setMessages(prev => [...prev, { sender: "bot", movie: reply }]);
    setInput("");
  };

  return (
    <div style={{ maxWidth: 700, margin: "2rem auto", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center" }}>💬 AI Movie Chatbot</h2>
      <div style={{
        border: "1px solid #ccc",
        borderRadius: 10,
        padding: "1rem",
        height: 500,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        backgroundColor: "#f5f5f5"
      }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            alignSelf: m.sender === "user" ? "flex-end" : "flex-start",
            maxWidth: "85%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: m.sender === "user" ? "#007bff" : "#ffffff",
            color: m.sender === "user" ? "#fff" : "#000",
            padding: 16,
            borderRadius: 12,
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
          }}>
            {m.sender === "user" ? (
              <span>{m.text}</span>
            ) : (
              <>
                <h3 style={{ margin: "0 0 0.5rem 0" }}>{m.movie.title}</h3>
                {m.movie.release && <span style={{ fontSize: "1rem", color: "#555" }}>Release: {m.movie.release}</span>}
                {m.movie.rating && <span style={{ fontSize: "1rem", color: "#555", marginLeft: 8 }}>⭐ Rating: {m.movie.rating}</span>}
                {m.movie.runtime && <span style={{ fontSize: "1rem", color: "#555", marginLeft: 8 }}>🕒 Runtime: {m.movie.runtime} min</span>}
                <p style={{ marginTop: 8, lineHeight: 1.4 }}>{m.movie.overview}</p>
              </>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask anything... (movies or general chat)"
          onKeyPress={e => e.key === "Enter" && handleSend()}
          style={{ flex: 1, padding: "0.75rem 1rem", borderRadius: 25, border: "1px solid #ccc", fontSize: 16 }}
        />
        <button onClick={handleSend} style={{
          padding: "0.75rem 1.5rem",
          borderRadius: 25,
          border: "none",
          backgroundColor: "#007bff",
          color: "#fff",
          fontWeight: "bold",
          cursor: "pointer"
        }}>Send</button>
      </div>
    </div>
  );
}
 