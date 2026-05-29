'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { ChatMsg, Profile } from '../lib/database.types';

export function useChat(userId: string | undefined, profile: Profile | null) {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Fetch chat messages from Supabase
  const fetchMessages = useCallback(async () => {
    if (!userId) return;
    setLoading(true);

    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: true });

    if (!error && data) {
      setMessages(data as ChatMsg[]);
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Send a message and get AI response
  const sendMessage = async (text: string): Promise<void> => {
    if (!userId || !profile) return;
    setSending(true);

    // 1. Save user message to Supabase
    const { data: userMsg, error: userErr } = await supabase
      .from('chat_messages')
      .insert({
        user_id: userId,
        role: 'user',
        content: text,
      })
      .select()
      .single();

    if (userErr) {
      console.error('Save user message error:', userErr);
      setSending(false);
      return;
    }

    // Optimistic update - add user message to state
    setMessages((prev) => [...prev, userMsg as ChatMsg]);

    // 2. Call AI triage API route
    try {
      const response = await fetch('/api/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          context: {
            name: profile.name,
            blood_group: profile.blood_group,
            genotype: profile.genotype,
            allergies: profile.allergies ?? [],
            medical_history: profile.medical_history ?? [],
            current_time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
            current_date: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
          },
          // Send recent message history for context (last 10 messages)
          history: messages.slice(-10).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('AI API request failed');
      }

      const aiData = await response.json();
      const aiContent = aiData.response || 'I apologize, I could not process your symptoms right now. Please try again or visit the clinic directly.';
      const aiThought = aiData.thought || '';

      // 3. Save AI response to Supabase
      const { data: aiMsg, error: aiErr } = await supabase
        .from('chat_messages')
        .insert({
          user_id: userId,
          role: 'assistant',
          content: aiContent,
          thought: aiThought,
        })
        .select()
        .single();

      if (!aiErr && aiMsg) {
        // Stream the message word by word
        const fullContent = aiMsg.content;
        const words = fullContent.split(' ');
        let currentText = '';

        // Add the message with empty content first
        const initialMsg = {
          ...aiMsg,
          content: '',
        } as ChatMsg;

        setMessages((prev) => [...prev, initialMsg]);

        let wordIndex = 0;
        await new Promise<void>((resolve) => {
          const timer = setInterval(() => {
            if (wordIndex < words.length) {
              currentText += (wordIndex === 0 ? '' : ' ') + words[wordIndex];
              setMessages((prev) =>
                prev.map((m) => (m.id === aiMsg.id ? { ...m, content: currentText } : m))
              );
              wordIndex++;
            } else {
              clearInterval(timer);
              resolve();
            }
          }, 30); // 30ms per word
        });
      }
    } catch (err) {
      console.error('AI triage error:', err);

      // Save fallback response
      const fallbackData = {
        thought: 'System Connection Error.\nTriage Level: Non-urgent / Informative.\nRecommended Action: Re-attempt request or contact clinic directly.',
        response: 'I\'m having trouble connecting to the medical server right now. Please try again in a moment. If you are experiencing a medical emergency, use the SOS button immediately.'
      };

      const { data: fallbackMsg } = await supabase
        .from('chat_messages')
        .insert({
          user_id: userId,
          role: 'assistant',
          content: fallbackData.response,
          thought: fallbackData.thought,
        })
        .select()
        .single();

      if (fallbackMsg) {
        const fullContent = fallbackMsg.content;
        const words = fullContent.split(' ');
        let currentText = '';

        const initialMsg = {
          ...fallbackMsg,
          content: '',
        } as ChatMsg;

        setMessages((prev) => [...prev, initialMsg]);

        let wordIndex = 0;
        await new Promise<void>((resolve) => {
          const timer = setInterval(() => {
            if (wordIndex < words.length) {
              currentText += (wordIndex === 0 ? '' : ' ') + words[wordIndex];
              setMessages((prev) =>
                prev.map((m) => (m.id === fallbackMsg.id ? { ...m, content: currentText } : m))
              );
              wordIndex++;
            } else {
              clearInterval(timer);
              resolve();
            }
          }, 30); // 30ms per word
        });
      }
    }

    setSending(false);
  };

  // Clear chat history
  const clearChat = async (): Promise<void> => {
    if (!userId) return;

    await supabase
      .from('chat_messages')
      .delete()
      .eq('user_id', userId);

    setMessages([]);
  };

  return {
    messages,
    loading,
    sending,
    sendMessage,
    clearChat,
    refetch: fetchMessages,
  };
}
