import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatBoxProps {
  messages: { id: string; user: string; text: string; ts: number }[];
  onSend: (text: string) => void;
}

const ChatBox = ({ messages, onSend }: ChatBoxProps) => {
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    const t = text.trim();
    if (!t) return;
    onSend(t);
    setText("");
  };

  return (
    <div className="flex flex-col h-64 border rounded-lg">
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((m) => (
          <div key={m.id} className="text-sm">
            <span className="font-semibold text-foreground">{m.user}: </span>
            <span className="text-muted-foreground">{m.text}</span>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="p-2 border-t flex gap-2">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message"
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <Button onClick={send}>Send</Button>
      </div>
    </div>
  );
};

export default ChatBox;
