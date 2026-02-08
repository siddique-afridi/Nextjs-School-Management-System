import ChatBot from "react-chatbotify";

export default function Chatbot() {
  const flow = {
    start: {
      message: `Hi! I'm your school assistant 🤖.
I can help you with the following:
- Say "hello" 👋 to greet me
- Ask "total students" to see how many are enrolled
- Type "teacher" to view all teachers and their subjects
- Say "result" to know about results 📊

How can I help you today?`,
      path: "user_response",
    },
    user_response: {
      message: async (params) => {
        const res = await fetch("https://schoolserver.up.railway.app/api/chatbot/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: params.userInput }),
        });
        const data = await res.json();
        return data.reply || "I didn’t understand that.";
      },

      path: "user_response",
    },
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <ChatBot
  flow={flow}
  options={{
    header: {
      title: "School Assistant 🤖",
      avatar: "https://cdn-icons-png.flaticon.com/512/4712/4712100.png",
    },
    theme: {
      primaryColor: "#4F46E5",
      secondaryColor: "#E0E7FF",
      userBubbleColor: "#14B8A6",
      botBubbleColor: "#4F46E5",
      headerColor: "#312E81",
    },
    footer: {
      show: true,
    },
    branding: {
      show: false,
    },
  }}
/>

    </div>
  );
}




//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");

//   const sendMessage = async () => {
//     if (!input.trim()) return;

//     const userMsg = { sender: "user", text: input };
//     setMessages(prev => [...prev, userMsg]);

//     const res = await fetch("http://localhost:5000/api/chatbot/chat", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ message: input }),
//     });
//     const data = await res.json();

//     const botMsg = { sender: "bot", text: data.reply };
//     setMessages(prev => [...prev, botMsg]);
//     setInput("");
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 border rounded-xl p-4 shadow-lg bg-white">
//       <div className="h-80 overflow-y-auto mb-4 p-2 bg-gray-50 rounded">
//         {messages.map((msg, i) => (
//           <div
//             key={i}
//             className={`my-2 ${
//               msg.sender === "user" ? "text-right" : "text-left"
//             }`}
//           >
//             <span
//               className={`inline-block px-3 py-2 rounded-xl ${
//                 msg.sender === "user"
//                   ? "bg-blue-500 text-white"
//                   : "bg-gray-300 text-black"
//               }`}
//             >
//               {msg.text}
//             </span>
//           </div>
//         ))}
//       </div>

//       <div className="flex gap-2">
//         <input
//           type="text"
//           className="border rounded-xl w-full px-3 py-2"
//           placeholder="Ask something..."
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//         />
//         <button
//           onClick={sendMessage}
//           className="bg-blue-500 text-white px-4 rounded-xl hover:bg-blue-600"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }
