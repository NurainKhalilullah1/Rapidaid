import { NextRequest, NextResponse } from 'next/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

interface TriageRequest {
  message: string;
  context: {
    name: string;
    blood_group: string;
    genotype: string;
    allergies: string[];
    medical_history: string[];
    current_time?: string;
    current_date?: string;
  };
  history?: { role: string; content: string }[];
}

const SYSTEM_PROMPT = `You are the Lead Medical Officer and AI Triage Adviser for the University of Ilorin (Unilorin) Campus Clinic. You speak with professional, calm, authoritative medical expertise, offering clear clinical reasoning and safe health guidance for students.

CLINICAL REASONING PROCESS:
Before answering, you must write a brief clinical analysis inside a <thought>...</thought> block. In this block, analyze:
1. The student's symptoms and potential severity (triage level: emergency, urgent, non-urgent).
2. Any relevant patient risk factors from their profile (genotype, blood group, allergies, chronic history).
3. Drug-allergy or drug-condition contraindications (e.g. avoiding NSAIDs/Ibuprofen for ulcer history, avoiding allergens).
4. Recommended clinical department at Unilorin (General Outpatient, Nursing, Dental, Pharmacy, Lab).
Keep this thought block concise but clinical.

RESPONSE STYLE:
After the thought block, write your final response inside a <response>...</response> block.
- Sound like a professional, reassuring, and highly knowledgeable medical adviser.
- Start with a polite professional greeting, using the student's name, tailored specifically to the student's current local time of day (e.g., Good morning, Good afternoon, Good evening, Good night).
- Explicitly explain the clinical rationale behind your advice (e.g., why they should avoid certain foods/drugs based on their history/genotype).
- Give clear, structured, actionable advice (e.g., hydration, OTC medications with exact usage guidelines, non-pharmacological relief).
- Keep the response professional, concise, and structured.
- End with a precise next-step clinical recommendation.

IMPORTANT RULES:
1. You are providing non-diagnostic symptom guidance. Never declare a definitive diagnosis.
2. For life-threatening symptoms (e.g. crushing chest pain, anaphylaxis, severe breathing difficulty, heavy bleeding), tell them to use the Emergency SOS button immediately.
3. Recommend clinic visits for persistent or moderate-to-severe issues.
4. When suggesting over-the-counter remedies, prefer common Nigerian pharmacy options (Paracetamol, ORS, etc.).

STUDENT MEDICAL PROFILE:
`;

export async function POST(request: NextRequest) {
  try {
    const body: TriageRequest = await request.json();
    const { message, context, history = [] } = body;

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (!GROQ_API_KEY || GROQ_API_KEY === 'your-groq-api-key-here') {
      const fallback = generateFallbackResponse(message);
      return NextResponse.json(fallback);
    }

    // Build student context string
    const studentContext = `
- Name: ${context.name}
- Blood Group: ${context.blood_group}
- Genotype: ${context.genotype}
- Allergies: ${context.allergies.length > 0 ? context.allergies.join(', ') : 'None logged'}
- Medical History: ${context.medical_history.length > 0 ? context.medical_history.join(', ') : 'No chronic conditions logged'}
- Current Date/Time: ${context.current_date || 'Unknown'} at ${context.current_time || 'Unknown'}
`;

    // Build messages array for Groq
    const messages = [
      {
        role: 'system' as const,
        content: SYSTEM_PROMPT + studentContext,
      },
      // Include conversation history for context
      ...history.map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
      {
        role: 'user' as const,
        content: message,
      },
    ];

    // Call Groq API
    const groqResponse = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages,
        max_tokens: 600,
        temperature: 0.5,
        top_p: 0.9,
      }),
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error('Groq API error:', groqResponse.status, errorText);

      // Fallback to rule-based response
      return NextResponse.json(generateFallbackResponse(message));
    }

    const groqData = await groqResponse.json();
    const aiResponse = groqData.choices?.[0]?.message?.content;

    if (!aiResponse) {
      return NextResponse.json(generateFallbackResponse(message));
    }

    const parsed = parseAIResponse(aiResponse);
    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Triage API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Parses LLM output to extract thought and response
function parseAIResponse(text: string): { thought: string; response: string } {
  let thought = '';
  let response = text;

  // Extract thought block
  const thoughtMatch = text.match(/<thought>([\s\S]*?)<\/thought>/i);
  if (thoughtMatch) {
    thought = thoughtMatch[1].trim();
  }

  // Extract response block
  const responseMatch = text.match(/<response>([\s\S]*?)<\/response>/i);
  if (responseMatch) {
    response = responseMatch[1].trim();
  } else if (thoughtMatch) {
    // Fallback: take everything after the thought block
    response = text.replace(/<thought>[\s\S]*?<\/thought>/i, '').trim();
  }

  // Strip XML tags just in case
  response = response.replace(/<\/?response>/gi, '').trim();

  return { thought, response };
}

// Fallback rule-based responses when Groq API is unavailable
function generateFallbackResponse(message: string): { thought: string; response: string } {
  const query = message.toLowerCase();

  if (query.includes('chest') || query.includes('breath') || query.includes('suffoca')) {
    return {
      thought: 'Symptom: Chest tightness/breathing difficulty.\nTriage Level: Emergency.\nContraindications: None. Immediate clinical evaluation required.\nSuggested Dept: Emergency Unit / General Outpatient.',
      response: '⚠️ **CRITICAL WARNING:** Chest pain or shortness of breath can be a severe emergency. Please use the **Emergency SOS button** immediately if you feel chest tightness or struggle to breathe.\n\nIf this is a mild asthma episode, sit upright and use your rescue inhaler. Head to the campus clinic as soon as possible.'
    };
  }

  if (query.includes('stomach') || query.includes('ulcer') || query.includes('belly') || query.includes('abdomen')) {
    return {
      thought: 'Symptom: Stomach pain.\nTriage Level: Urgent/Non-urgent.\nContraindications: Avoid NSAIDs (Ibuprofen, Diclofenac) which exacerbate ulcers.\nSuggested Dept: General Outpatient.',
      response: 'Stomach discomfort can relate to gastritis, ulcer flare-ups, or indigestion. Please avoid spicy foods, NSAIDs (like Ibuprofen), and fizzy drinks. Try drinking water or warm milk. If the pain is sharp, burning, or persistent, please book an appointment at the **General Outpatient Department**.'
    };
  }

  if (query.includes('headache') || query.includes('fever') || query.includes('malaria')) {
    return {
      thought: 'Symptom: Headache and fever.\nTriage Level: Urgent.\nContraindications: None. Perform malaria rapid test.\nSuggested Dept: Nursing Unit / Laboratory.',
      response: 'Headache with fever in our environment is commonly associated with malaria or typhoid. Please visit the **Nursing Unit / Laboratory** for a rapid diagnostic test (RDT). Rest well, stay hydrated, and you can take Paracetamol (Acetaminophen) for temporary relief.'
    };
  }

  if (query.includes('dizzy') || query.includes('faint') || query.includes('weak')) {
    return {
      thought: 'Symptom: Dizziness/Weakness.\nTriage Level: Urgent.\nContraindications: Avoid sudden movements.\nSuggested Dept: General Outpatient / Nursing.',
      response: 'Dizziness can indicate dehydration, low blood sugar, or low blood pressure. Please lie down, elevate your feet, and drink water or a sugary beverage. If this persists or you lose consciousness, use the Emergency SOS button immediately.'
    };
  }

  return {
    thought: 'Symptom: Unspecified general health query.\nTriage Level: Non-urgent.\nContraindications: Monitor closely.\nSuggested Dept: General Outpatient / Health Education.',
    response: `Thank you for sharing your symptoms. Based on general campus health guidelines:\n\n1. **Rest** and monitor your condition\n2. **Stay hydrated** — drink water regularly\n3. **Track your temperature** if you feel warm\n4. If symptoms worsen, **book a clinic appointment**\n\n*Note: I\'m an AI assistant, not a doctor. For urgent situations, use the Emergency SOS button.*`
  };
}
