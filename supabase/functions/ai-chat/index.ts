import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Processing chat request with", messages.length, "messages");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { 
            role: "system", 
            content: `You are AIMbot, a friendly and helpful AI learning assistant for AIM Centre 360, an educational platform focused on inclusive education in Bangladesh.

Your role is to:
- Help students with their learning questions across all subjects
- Provide study tips and learning strategies
- Explain concepts in simple, easy-to-understand language
- Support students with special needs by adapting explanations as needed
- Encourage and motivate students in their educational journey
- Answer questions about the platform's courses and features

Guidelines:
- Be warm, patient, and encouraging
- Use simple language appropriate for students of all ages
- When explaining complex topics, break them down into smaller steps
- If asked about topics outside education, gently redirect to learning-related topics
- Support both English and Bangla (বাংলা) when appropriate
- Never provide harmful, inappropriate, or misleading information

Keep responses concise but helpful. Use emojis sparingly to make conversations friendly.`
          },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      console.error("AI gateway error:", response.status);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please wait a moment and try again." }), 
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service temporarily unavailable. Please try again later." }), 
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const errorText = await response.text();
      console.error("Error details:", errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat function error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "An unexpected error occurred" 
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
