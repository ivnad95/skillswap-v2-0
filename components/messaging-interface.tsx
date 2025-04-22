"use client";

import { useState, useEffect, useCallback, useRef, FormEvent } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge"; // Import Badge
import { Search, Send, Phone, Video, Info, Paperclip, Smile, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { ConversationListItem, DbMessage } from "@/lib/db"; // Import types
import { formatDistanceToNow } from 'date-fns'; // For relative timestamps
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";

// Type for displayed messages, adding isOwn property
interface DisplayMessage extends DbMessage {
  isOwn: boolean;
}

export function MessagingInterface() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<ConversationListItem[]>([]);
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ConversationListItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null); // Ref to scroll to bottom

  // --- Data Fetching ---

  // Fetch conversation list
  const fetchConversations = useCallback(async () => {
    if (!user) return;
    setIsLoadingConversations(true);
    setError(null);
    try {
      const res = await fetch('/api/messages/conversations');
      if (!res.ok) throw new Error('Failed to load conversations');
      const data = await res.json();
      setConversations(data.conversations || []);
      // Automatically select the first conversation if none is selected
      if (!selectedConversation && data.conversations?.length > 0) {
         // Don't automatically select here, let user click
         // setSelectedConversation(data.conversations[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load conversations.");
      toast({ variant: "destructive", title: "Error", description: "Could not load conversations." });
    } finally {
      setIsLoadingConversations(false);
    }
  }, [user, toast, selectedConversation]); // Added selectedConversation dependency

  // Fetch messages for the selected conversation
  const fetchMessages = useCallback(async (partnerId: string) => {
    if (!user || !partnerId) return;
    setIsLoadingMessages(true);
    try {
      const res = await fetch(`/api/messages?userId=${partnerId}`);
      if (!res.ok) throw new Error('Failed to load messages');
      const data = await res.json();
      const fetchedMessages: DbMessage[] = data.messages || [];
      setMessages(fetchedMessages.map(msg => ({ ...msg, isOwn: msg.sender_id === user.id })));

      // Mark messages as read (fire and forget)
      fetch('/api/messages/read', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderId: partnerId })
      }).catch(err => console.error("Failed to mark messages as read:", err));

      // Update unread count in conversation list locally
      setConversations(prev => prev.map(convo =>
        convo.partnerId === partnerId ? { ...convo, unreadCount: 0 } : convo
      ));

    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Could not load messages." });
    } finally {
      setIsLoadingMessages(false);
    }
  }, [user, toast]);

  // Initial fetch of conversations
  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user, fetchConversations]);

  // Fetch messages when selected conversation changes
  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.partnerId);
    } else {
      setMessages([]); // Clear messages if no conversation is selected
    }
  }, [selectedConversation, fetchMessages]);

   // Scroll to bottom when messages load or new message is added
   useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- Event Handlers ---

  const handleSelectConversation = (conversation: ConversationListItem) => {
    setSelectedConversation(conversation);
  };

  const handleSendMessage = async (e?: FormEvent) => {
    e?.preventDefault(); // Prevent form submission if used in a form
    if (messageInput.trim() === "" || !selectedConversation || !user || isSending) return;

    const partnerId = selectedConversation.partnerId;
    const content = messageInput.trim();
    setMessageInput(""); // Clear input immediately
    setIsSending(true);

    // Optimistic UI update
    const optimisticMessage: DisplayMessage = {
      id: `temp-${Date.now()}`, // Temporary ID
      sender_id: user.id,
      recipient_id: partnerId,
      content: content,
      created_at: new Date().toISOString(),
      isOwn: true,
    };
    setMessages(prev => [...prev, optimisticMessage]);

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientId: partnerId, content }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }
      const data = await response.json();

      // Replace optimistic message with real one from server (optional, if needed)
      setMessages(prev => prev.map(msg =>
        msg.id === optimisticMessage.id ? { ...optimisticMessage, id: data.messageId } : msg
      ));

      // Refresh conversation list to show new last message
      fetchConversations();

    } catch (err) {
      console.error("Error sending message:", err);
      toast({ variant: "destructive", title: "Error", description: "Failed to send message." });
      // Remove optimistic message on failure
      setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
    } finally {
      setIsSending(false);
    }
  };

  // Filter conversations based on search term
  const filteredConversations = conversations.filter(contact =>
    `${contact.partnerFirstName || ''} ${contact.partnerLastName || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-120px)] border border-border/50 rounded-lg overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 border-r border-primary/10 flex flex-col">
        <div className="p-4 border-b border-primary/10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search messages..."
              className="pl-10 bg-background/50 backdrop-blur-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <ScrollArea className="flex-1">
          {isLoadingConversations ? (
             <div className="p-4 text-center text-muted-foreground">Loading...</div>
          ) : error ? (
             <div className="p-4 text-center text-red-500">{error}</div>
          ) : filteredConversations.length === 0 ? (
             <div className="p-4 text-center text-muted-foreground">No conversations found.</div>
          ) : (
            filteredConversations.map((convo) => (
            <Button
              key={convo.partnerId}
              variant="ghost"
              className={`w-full justify-start h-auto p-4 rounded-none ${selectedConversation?.partnerId === convo.partnerId ? 'bg-muted/50' : ''}`}
              onClick={() => handleSelectConversation(convo)}
            >
              <Avatar className="mr-3">
                <AvatarImage src={convo.partnerProfileImage || "/placeholder-user.jpg"} alt={`${convo.partnerFirstName} ${convo.partnerLastName}`} />
                <AvatarFallback>{convo.partnerFirstName?.[0]}{convo.partnerLastName?.[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left min-w-0">
                <div className="flex justify-between items-center">
                  <span className="font-medium truncate">{`${convo.partnerFirstName || ''} ${convo.partnerLastName || ''}`.trim()}</span>
                  <span className="text-xs text-muted-foreground">
                     {formatDistanceToNow(new Date(convo.lastMessageTimestamp), { addSuffix: true })}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-sm text-muted-foreground truncate">{convo.lastMessageContent}</p>
                  {convo.unreadCount > 0 && (
                    <Badge className="h-5 w-5 p-0 flex items-center justify-center bg-primary text-primary-foreground text-xs">
                      {convo.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
            </Button>
          )))}
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-background">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="h-16 border-b border-primary/10 flex items-center justify-between px-6">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={selectedConversation.partnerProfileImage || "/placeholder-user.jpg"} />
                  <AvatarFallback>{selectedConversation.partnerFirstName?.[0]}{selectedConversation.partnerLastName?.[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{`${selectedConversation.partnerFirstName || ''} ${selectedConversation.partnerLastName || ''}`.trim()}</h3>
                  {/* <p className="text-xs text-muted-foreground">Online</p> */} {/* TODO: Add online status if available */}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Add actions if needed */}
                {/* <Button variant="ghost" size="icon"><Phone className="h-5 w-5" /></Button> */}
                {/* <Button variant="ghost" size="icon"><Video className="h-5 w-5" /></Button> */}
                {/* <Button variant="ghost" size="icon"><Info className="h-5 w-5" /></Button> */}
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-6 space-y-4">
              {isLoadingMessages ? (
                 <div className="flex justify-center items-center h-full">
                   <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                 </div>
              ) : messages.length === 0 ? (
                 <div className="flex justify-center items-center h-full text-muted-foreground">
                    No messages yet. Start the conversation!
                 </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex items-end gap-2",
                      message.isOwn ? "justify-end" : "justify-start"
                    )}
                  >
                    {!message.isOwn && (
                       <Avatar className="h-6 w-6 self-end mb-1"> {/* Align avatar */}
                         <AvatarImage src={selectedConversation.partnerProfileImage || "/placeholder-user.jpg"} />
                         <AvatarFallback>{selectedConversation.partnerFirstName?.[0]}{selectedConversation.partnerLastName?.[0]}</AvatarFallback>
                       </Avatar>
                    )}
                    <div
                      className={cn(
                        "max-w-[70%] rounded-lg p-3 text-sm shadow-md",
                        message.isOwn
                          ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                          : "bg-muted"
                      )}
                    >
                      <p>{message.content}</p>
                       <p className={`text-xs mt-1 ${message.isOwn ? "text-purple-100/70" : "text-muted-foreground/80"} text-right`}>
                         {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                       </p>
                    </div>
                  </div>
                ))
              )}
               <div ref={messagesEndRef} /> {/* Element to scroll to */}
            </ScrollArea>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="border-t border-primary/10 p-4">
              <div className="flex items-center gap-2">
                {/* <Button type="button" variant="ghost" size="icon"><Paperclip className="h-5 w-5" /></Button> */}
                <Input
                  placeholder="Type a message..."
                  className="flex-1 bg-background/50 backdrop-blur-sm"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  disabled={isSending}
                />
                {/* <Button type="button" variant="ghost" size="icon"><Smile className="h-5 w-5" /></Button> */}
                <Button
                  type="submit"
                  size="icon"
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                  disabled={messageInput.trim() === "" || isSending}
                >
                  {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select a conversation to start chatting.
          </div>
        )}
      </div>
    </div>
  );
}
