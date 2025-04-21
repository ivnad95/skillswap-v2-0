"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Phone, Video, Info, Paperclip, Send, Smile } from "lucide-react"

export function MessagingInterface() {
  const [activeChat, setActiveChat] = useState("1")

  const contacts = [
    {
      id: "1",
      name: "Alex Chen",
      avatar: "/contemplative-man.png",
      lastMessage: "When should we schedule our next JavaScript session?",
      time: "10:30 AM",
      unread: 2,
      online: true,
    },
    {
      id: "2",
      name: "Sarah Johnson",
      avatar: "/contemplative-artist.png",
      lastMessage: "Thanks for the React tutorial yesterday!",
      time: "Yesterday",
      unread: 0,
      online: true,
    },
    {
      id: "3",
      name: "Michael Wong",
      avatar: "/thoughtful-reader.png",
      lastMessage: "I've completed the Python assignment you gave me.",
      time: "Yesterday",
      unread: 0,
      online: false,
    },
    {
      id: "4",
      name: "Maya Patel",
      avatar: "/contemplative-artist.png",
      lastMessage: "Looking forward to our yoga session on Friday!",
      time: "Monday",
      unread: 0,
      online: false,
    },
  ]

  const messages = [
    {
      id: "1",
      sender: "Alex Chen",
      content: "Hi John! How are you doing today?",
      time: "10:15 AM",
      isMe: false,
    },
    {
      id: "2",
      sender: "Me",
      content: "Hey Alex! I'm doing great, thanks for asking. How about you?",
      time: "10:17 AM",
      isMe: true,
    },
    {
      id: "3",
      sender: "Alex Chen",
      content: "I'm good too! Just preparing for our JavaScript session.",
      time: "10:20 AM",
      isMe: false,
    },
    {
      id: "4",
      sender: "Alex Chen",
      content: "When should we schedule our next JavaScript session? I'm free on Thursday and Friday afternoon.",
      time: "10:30 AM",
      isMe: false,
    },
  ]

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Contacts Sidebar */}
      <div className="w-80 border-r border-primary/10 flex flex-col">
        <div className="p-4 border-b border-primary/10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search messages..." className="pl-10 bg-background/50 backdrop-blur-sm" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 ${
                activeChat === contact.id ? "bg-muted/50" : ""
              }`}
              onClick={() => setActiveChat(contact.id)}
            >
              <div className="relative">
                <Avatar>
                  <AvatarImage src={contact.avatar || "/placeholder.svg"} alt={contact.name} />
                  <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                </Avatar>
                {contact.online && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium truncate">{contact.name}</h3>
                  <span className="text-xs text-muted-foreground">{contact.time}</span>
                </div>
                <p className="text-sm text-muted-foreground truncate">{contact.lastMessage}</p>
              </div>
              {contact.unread > 0 && (
                <div className="h-5 w-5 rounded-full bg-purple-500 flex items-center justify-center">
                  <span className="text-xs text-white">{contact.unread}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="h-16 border-b border-primary/10 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="/contemplative-man.png" alt="Alex Chen" />
              <AvatarFallback>AC</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">Alex Chen</h3>
              <p className="text-xs text-muted-foreground">Online</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Phone className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Video className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Info className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.isMe ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.isMe
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                    : "bg-muted/50 backdrop-blur-sm"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${message.isMe ? "text-white/70" : "text-muted-foreground"}`}>
                  {message.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="border-t border-primary/10 p-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Paperclip className="h-5 w-5" />
            </Button>
            <Input placeholder="Type a message..." className="flex-1 bg-background/50 backdrop-blur-sm" />
            <Button variant="ghost" size="icon">
              <Smile className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
