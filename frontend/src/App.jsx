import { useEffect, useState, useRef } from "react";

function App() {
  const [messages, setMessages] = useState(["hii"]);
  const ws = useRef(null); // Store WebSocket in a ref

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8080"); // Correct WebSocket URL

    ws.current.onopen = () => {
      ws.current.send(
        JSON.stringify({
          type: "join",
          payload: { roomid: "red" },
        })
      );
    };

    ws.current.onmessage = (event) => {
      setMessages((m) => [...m, event.data]);
    };

    ws.current.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => ws.current.close(); // Cleanup WebSocket on unmount
  }, []);

  return (
    <div className="h-screen bg-black">
      <div className="h-[90vh] bg-red-300">
        {messages.map((msg, index) => (
          <span key={index} className="bg-white text-black rounded p-4 m-8">
            {msg}
          </span>
        ))}
      </div>
      <div className="w-full bg-white flex">
        <input id="message" className="flex-1" />
        <button
          className="bg-purple-600 text-white p-4 cursor-pointer"
          onClick={() => {
            const message = document.getElementById("message").value;
            if (ws.current && ws.current.readyState === WebSocket.OPEN) {
              ws.current.send(
                JSON.stringify({
                  type: "chat",
                  payload: { message: message },
                })
              );
            } else {
              console.log("WebSocket is not open yet.");
            }
          }}
        >
          Send Message
        </button>
      </div>
    </div>
  );
}

export default App;
