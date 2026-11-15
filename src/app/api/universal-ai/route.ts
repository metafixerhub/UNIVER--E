import { NextRequest, NextResponse } from 'next/server';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const MODEL_ID = 'nvidia/nemotron-3-ultra-550b-a55b:free';

// Clean code blocks from LLM markdown responses
function extractCleanJson(text: string): any {
  try {
    const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (e) {
    // Attempt to extract between [ and ] or { and }
    const firstBracket = text.indexOf('[');
    const lastBracket = text.lastIndexOf(']');
    if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
      try {
        return JSON.parse(text.substring(firstBracket, lastBracket + 1));
      } catch (err) {}
    }
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      try {
        return JSON.parse(text.substring(firstBrace, lastBrace + 1));
      } catch (err) {}
    }
    return null;
  }
}

// Generate self-contained, beautifully styled UNIVER-E Interactive Quiz HTML runner
function generateSelfContainedQuizHtml(
  title: string,
  topic: string,
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }>,
  timeMinutes: number = 10
): string {
  const safeTitle = title.replace(/"/g, '&quot;');
  const safeTopic = topic.replace(/"/g, '&quot;');
  const jsonQuestions = JSON.stringify(questions);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeTitle} - UNIVER-E Interactive Quiz</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    body { background: #F5F8FC; color: #082B59; padding: 24px; min-height: 100vh; display: flex; justify-content: center; align-items: center; }
    .quiz-card { background: #FFFFFF; border-radius: 20px; box-shadow: 0 10px 30px rgba(8, 43, 89, 0.08); width: 100%; max-width: 720px; overflow: hidden; border: 1px solid #E2E8F0; }
    .quiz-header { background: #082B59; color: #FFFFFF; padding: 20px 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
    .quiz-badge { background: #F5A900; color: #082B59; padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; }
    .quiz-timer { background: rgba(255, 255, 255, 0.12); padding: 6px 14px; border-radius: 12px; font-family: monospace; font-size: 14px; font-weight: bold; color: #13A8E8; display: flex; align-items: center; gap: 6px; }
    .progress-bar-container { width: 100%; height: 6px; background: #E2E8F0; }
    .progress-bar { height: 100%; background: #13A8E8; width: 0%; transition: width 0.3s ease; }
    .quiz-body { padding: 28px 24px; }
    .q-meta { font-size: 12px; font-weight: 700; color: #13A8E8; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.5px; }
    .q-text { font-size: 18px; font-weight: 700; color: #082B59; line-height: 1.4; margin-bottom: 20px; }
    .options-grid { display: flex; flex-direction: column; gap: 10px; }
    .option-btn { background: #F8FAFC; border: 1.5px solid #CBD5E1; border-radius: 12px; padding: 14px 16px; font-size: 14px; text-align: left; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; gap: 12px; color: #1E293B; font-weight: 500; }
    .option-btn:hover:not(:disabled) { border-color: #13A8E8; background: #F0F9FF; }
    .option-letter { width: 28px; height: 28px; border-radius: 8px; background: #E2E8F0; color: #082B59; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 12px; flex-shrink: 0; }
    .option-btn.selected { border-color: #13A8E8; background: #E0F2FE; }
    .option-btn.correct { border-color: #28A745; background: #DCFCE7; color: #166534; font-weight: 600; }
    .option-btn.correct .option-letter { background: #28A745; color: #FFFFFF; }
    .option-btn.wrong { border-color: #EF4444; background: #FEE2E2; color: #991B1B; }
    .option-btn.wrong .option-letter { background: #EF4444; color: #FFFFFF; }
    .explanation-box { margin-top: 18px; padding: 14px 16px; border-radius: 12px; font-size: 13px; line-height: 1.5; background: #EFF6FF; border-left: 4px solid #13A8E8; color: #1E3A8A; display: none; }
    .quiz-footer { padding: 16px 24px; background: #F8FAFC; border-top: 1px solid #E2E8F0; display: flex; justify-content: space-between; align-items: center; }
    .action-btn { background: #F5A900; color: #082B59; border: none; padding: 10px 22px; border-radius: 10px; font-weight: 700; font-size: 14px; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 2px 6px rgba(245, 169, 0, 0.3); }
    .action-btn:hover { background: #D99500; transform: translateY(-1px); }
    .action-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }
    .results-view { text-align: center; padding: 36px 20px; display: none; }
    .results-score-circle { width: 110px; height: 110px; border-radius: 50%; margin: 0 auto 18px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-weight: 900; font-size: 28px; }
    .pass { background: #DCFCE7; color: #166534; border: 4px solid #28A745; }
    .fail { background: #FEE2E2; color: #991B1B; border: 4px solid #EF4444; }
    .confetti-canvas { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 999; }
  </style>
</head>
<body>
  <canvas id="confetti" class="confetti-canvas"></canvas>

  <div class="quiz-card">
    <div class="quiz-header">
      <div>
        <span class="quiz-badge">Universal AI Generated Quiz</span>
        <h2 style="font-size: 16px; margin-top: 4px;">${safeTitle}</h2>
      </div>
      <div class="quiz-timer">
        <span>⏱️</span>
        <span id="timer-display">--:--</span>
      </div>
    </div>
    <div class="progress-bar-container">
      <div id="progress-bar" class="progress-bar"></div>
    </div>

    <!-- Active Question View -->
    <div id="question-view" class="quiz-body">
      <div id="q-counter" class="q-meta">Question 1 of 5</div>
      <div id="q-text" class="q-text">Loading question...</div>
      <div id="options-container" class="options-grid"></div>
      <div id="explanation-box" class="explanation-box"></div>
    </div>

    <!-- Results View -->
    <div id="results-view" class="results-view">
      <div id="score-circle" class="results-score-circle pass">
        <span id="score-pct">0%</span>
      </div>
      <h2 id="result-status" style="font-size: 22px; color: #082B59; margin-bottom: 8px;">Assessment Completed!</h2>
      <p id="result-detail" style="font-size: 14px; color: #64748B; margin-bottom: 24px;">You scored 0 out of 0 questions.</p>
      <button class="action-btn" onclick="restartQuiz()">Retake Quiz</button>
    </div>

    <div class="quiz-footer" id="quiz-footer">
      <span id="footer-topic" style="font-size: 12px; color: #64748B; font-weight: 600;">Topic: ${safeTopic}</span>
      <button id="next-btn" class="action-btn" onclick="nextQuestion()" disabled>Next Question &rarr;</button>
    </div>
  </div>

  <script>
    const questions = ${jsonQuestions};
    let currentIndex = 0;
    let score = 0;
    let selectedOption = null;
    let hasAnswered = false;
    let timeLeft = ${timeMinutes * 60};
    let timerInterval = null;

    function startTimer() {
      const display = document.getElementById('timer-display');
      timerInterval = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          finishQuiz();
          return;
        }
        const mins = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;
        display.textContent = (mins < 10 ? '0' : '') + mins + ':' + (secs < 10 ? '0' : '') + secs;
      }, 1000);
    }

    function renderQuestion() {
      const q = questions[currentIndex];
      hasAnswered = false;
      selectedOption = null;

      document.getElementById('progress-bar').style.width = ((currentIndex) / questions.length * 100) + '%';
      document.getElementById('q-counter').textContent = 'Question ' + (currentIndex + 1) + ' of ' + questions.length;
      document.getElementById('q-text').textContent = q.question;
      document.getElementById('explanation-box').style.display = 'none';
      document.getElementById('next-btn').disabled = true;
      document.getElementById('next-btn').textContent = (currentIndex === questions.length - 1) ? 'Submit Assessment' : 'Next Question \u2192';

      const letters = ['A', 'B', 'C', 'D'];
      const container = document.getElementById('options-container');
      container.innerHTML = '';

      q.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerHTML = '<span class="option-letter">' + letters[idx] + '</span><span>' + opt + '</span>';
        btn.onclick = () => selectOption(idx);
        container.appendChild(btn);
      });
    }

    function selectOption(index) {
      if (hasAnswered) return;
      hasAnswered = true;
      selectedOption = index;

      const q = questions[currentIndex];
      const buttons = document.querySelectorAll('.option-btn');

      buttons.forEach((btn, idx) => {
        btn.disabled = true;
        if (idx === q.correctAnswer) {
          btn.classList.add('correct');
        } else if (idx === selectedOption) {
          btn.classList.add('wrong');
        }
      });

      if (selectedOption === q.correctAnswer) {
        score++;
      }

      const expBox = document.getElementById('explanation-box');
      expBox.innerHTML = '<strong>Explanation:</strong> ' + q.explanation;
      expBox.style.display = 'block';

      document.getElementById('next-btn').disabled = false;
    }

    function nextQuestion() {
      if (currentIndex < questions.length - 1) {
        currentIndex++;
        renderQuestion();
      } else {
        finishQuiz();
      }
    }

    function finishQuiz() {
      clearInterval(timerInterval);
      document.getElementById('question-view').style.display = 'none';
      document.getElementById('quiz-footer').style.display = 'none';
      document.getElementById('results-view').style.display = 'block';
      document.getElementById('progress-bar').style.width = '100%';

      const pct = Math.round((score / questions.length) * 100);
      document.getElementById('score-pct').textContent = pct + '%';
      document.getElementById('result-detail').textContent = 'You scored ' + score + ' out of ' + questions.length + ' correct (' + pct + '%).';

      const circle = document.getElementById('score-circle');
      if (pct >= 70) {
        circle.className = 'results-score-circle pass';
        document.getElementById('result-status').textContent = '\uD83C\uDF89 Congratulations! Assessment Passed!';
        triggerConfetti();
      } else {
        circle.className = 'results-score-circle fail';
        document.getElementById('result-status').textContent = 'Need More Practice';
      }
    }

    function restartQuiz() {
      currentIndex = 0;
      score = 0;
      timeLeft = ${timeMinutes * 60};
      document.getElementById('question-view').style.display = 'block';
      document.getElementById('quiz-footer').style.display = 'flex';
      document.getElementById('results-view').style.display = 'none';
      startTimer();
      renderQuestion();
    }

    function triggerConfetti() {
      const canvas = document.getElementById('confetti');
      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const particles = [];
      const colors = ['#F5A900', '#13A8E8', '#28A745', '#082B59', '#E11D48'];

      for (let i = 0; i < 70; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * -canvas.height,
          size: Math.random() * 8 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: Math.random() * 4 - 2,
          vy: Math.random() * 3 + 2,
          rot: Math.random() * 360,
        });
      }

      let frame = 0;
      function anim() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          ctx.fillStyle = p.color;
          ctx.fillRect(p.x, p.y, p.size, p.size);
        });
        frame++;
        if (frame < 180) requestAnimationFrame(anim);
        else ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      anim();
    }

    // Initialize on load
    startTimer();
    renderQuestion();
  </script>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, transcript, topic, courseTitle, prompt, count = 5 } = body;

    // Direct Chat Mode
    if (action === 'chat') {
      const userPrompt = prompt || transcript || 'Hello Universal AI';
      const systemPrompt = `You are "Universal AI", the cutting-edge pedagogical artificial intelligence engine of UNIVER-E Digital Academy.
You specialize in transcriptional learning, flashcard synthesis, dynamic quiz generation, and curriculum design.
You give structured, authoritative, inspiring responses adhering to UNIVER-E brand principles.`;

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://univer-e.in',
          'X-Title': 'UNIVER-E Universal AI Engine',
        },
        body: JSON.stringify({
          model: MODEL_ID,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.3,
          max_tokens: 1500,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenRouter returned status ${response.status}`);
      }
      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || 'Universal AI received your instruction.';
      return NextResponse.json({ success: true, reply });
    }

    // Transcriptional Learning Mode
    if (action === 'transcript') {
      const lectureNotes = transcript || prompt || '';
      const courseName = courseTitle || 'Digital Specialization';

      const systemPrompt = `You are "Universal AI - Transcriptional Learning Engine" for UNIVER-E.
Given a lecture transcript, voice recording notes, or syllabus text for the course "${courseName}", your task is to generate a deep pedagogical synthesis:
1. Executive Lecture Summary (2-3 concise paragraphs)
2. 5 Core Conceptual Takeaways & Definitions
3. Essential Formulas, Syntaxes, or Rule-Sets (if applicable)
4. Actionable Study Bullets & Best Practices
5. 3 Diagnostic Reflection Questions for students to test their retention

Format your output in clean, professional GitHub Markdown with clear section headers and bold highlights.`;

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://univer-e.in',
          'X-Title': 'UNIVER-E Universal AI Engine',
        },
        body: JSON.stringify({
          model: MODEL_ID,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Analyze and synthesize this lecture transcript:\n\n${lectureNotes}` },
          ],
          temperature: 0.25,
          max_tokens: 2048,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenRouter returned status ${response.status}`);
      }
      const data = await response.json();
      const markdown = data.choices?.[0]?.message?.content || '';
      return NextResponse.json({ success: true, markdown });
    }

    // Flashcard Creation Mode
    if (action === 'flashcards') {
      const subject = topic || courseTitle || 'Computer Science & AI';
      const notes = transcript || prompt || '';

      const systemPrompt = `You are "Universal AI - Flashcard Generator" for UNIVER-E.
Create ${count} high-yield study flashcards for "${subject}".
Based on: "${notes || subject}".
Return ONLY a valid JSON array of objects with NO surrounding markdown backticks.
Each object must have exactly:
{
  "id": "fc_1",
  "front": "Prompt or Question or Concept",
  "back": "Clear, complete explanation or solution",
  "category": "${subject}",
  "difficulty": "easy" | "medium" | "hard"
}`;

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://univer-e.in',
          'X-Title': 'UNIVER-E Universal AI Engine',
        },
        body: JSON.stringify({
          model: MODEL_ID,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Generate ${count} flashcards for ${subject}` },
          ],
          temperature: 0.3,
          max_tokens: 1500,
        }),
      });

      let flashcards: any[] = [];
      if (response.ok) {
        const data = await response.json();
        const rawContent = data.choices?.[0]?.message?.content || '';
        const parsed = extractCleanJson(rawContent);
        if (Array.isArray(parsed) && parsed.length > 0) {
          flashcards = parsed.map((item, idx) => ({
            id: `fc_${Date.now()}_${idx}`,
            front: item.front || `Concept ${idx + 1}`,
            back: item.back || 'Detailed concept explanation.',
            category: item.category || subject,
            difficulty: item.difficulty || 'medium',
          }));
        }
      }

      // Robust fallback if parsing or API returned empty
      if (flashcards.length === 0) {
        flashcards = [
          {
            id: `fc_${Date.now()}_1`,
            front: `What is the core principle of ${subject}?`,
            back: `${subject} leverages foundational algorithmic paradigms, state isolation, and repeatable patterns to deliver robust production architectures.`,
            category: subject,
            difficulty: 'easy',
          },
          {
            id: `fc_${Date.now()}_2`,
            front: `How do you optimize performance and throughput in ${subject}?`,
            back: `By utilizing vectorization, efficient indexing, caching hot memory paths, and asynchronous non-blocking pipelines.`,
            category: subject,
            difficulty: 'medium',
          },
          {
            id: `fc_${Date.now()}_3`,
            front: `What common anti-pattern should be avoided in ${subject}?`,
            back: `Premature optimization without profiling, storing unhashed credentials, and tight coupling of stateful presentation layers.`,
            category: subject,
            difficulty: 'hard',
          },
        ];
      }

      return NextResponse.json({ success: true, flashcards });
    }

    // Automatic Quiz Making & Direct HTML Runner Mode
    if (action === 'quiz_html') {
      const subject = topic || courseTitle || 'Web & AI Specialization';
      const notes = transcript || prompt || '';
      const qCount = Math.min(10, Math.max(3, Number(count) || 5));

      const systemPrompt = `You are "Universal AI - Quiz Architect" for UNIVER-E.
Generate ${qCount} multiple-choice assessment questions for "${subject}".
Return ONLY a valid JSON array of objects with NO surrounding markdown backticks.
Each object must have:
{
  "id": "q1",
  "question": "Clear technical question",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": 0, // Integer 0 to 3
  "explanation": "Clear explanation of why this answer is correct"
}`;

      let questions: any[] = [];
      try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://univer-e.in',
            'X-Title': 'UNIVER-E Universal AI Engine',
          },
          body: JSON.stringify({
            model: MODEL_ID,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: `Generate ${qCount} questions based on: ${notes || subject}` },
            ],
            temperature: 0.3,
            max_tokens: 2000,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const rawContent = data.choices?.[0]?.message?.content || '';
          const parsed = extractCleanJson(rawContent);
          if (Array.isArray(parsed) && parsed.length > 0) {
            questions = parsed.map((q, idx) => ({
              id: `q_${Date.now()}_${idx}`,
              question: q.question,
              options: Array.isArray(q.options) && q.options.length === 4 ? q.options : ['Option A', 'Option B', 'Option C', 'Option D'],
              correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
              explanation: q.explanation || 'Verified UNIVER-E academic answer explanation.',
            }));
          }
        }
      } catch (e) {
        console.warn('OpenRouter call error:', e);
      }

      // Fallback questions if LLM response couldn't be parsed
      if (questions.length === 0) {
        questions = [
          {
            id: `q_${Date.now()}_1`,
            question: `In modern ${subject}, what is the primary advantage of asynchronous non-blocking execution?`,
            options: [
              'It eliminates the need for any database transactions',
              'It allows high I/O throughput without stalling the main thread',
              'It automatically compiles JavaScript into C++ binary code',
              'It removes network latency across international data centers',
            ],
            correctAnswer: 1,
            explanation: 'Asynchronous event loops permit high concurrency by handling I/O without blocking subsequent compute cycles.',
          },
          {
            id: `q_${Date.now()}_2`,
            question: `Which data structure provides constant time O(1) average lookup in production software architectures?`,
            options: ['Binary Search Tree', 'Doubly Linked List', 'Hash Table / Hash Map', 'Linear Array'],
            correctAnswer: 2,
            explanation: 'Hash tables map keys to bucket indices using a hash function, delivering O(1) average access.',
          },
          {
            id: `q_${Date.now()}_3`,
            question: `When deploying production services under Indian DPDP Act 2023 compliance, how must sensitive credentials be stored?`,
            options: [
              'In plain text CSV files inside the root public directory',
              'Cryptographically hashed with salted algorithms like Argon2 or bcrypt',
              'Base64 encoded directly in client HTML source',
              'Shared via unencrypted query parameters in GET requests',
            ],
            correctAnswer: 1,
            explanation: 'Mandatory data protection laws require cryptographic irreversible one-way hashing with per-user salt.',
          },
        ];
      }

      // Generate the self-contained HTML runner
      const htmlRunner = generateSelfContainedQuizHtml(
        courseTitle || `${subject} Assessment`,
        subject,
        questions,
        10
      );

      return NextResponse.json({
        success: true,
        questions,
        htmlRunner,
      });
    }

    return NextResponse.json({ error: 'Unrecognized action' }, { status: 400 });
  } catch (error: any) {
    console.error('Universal AI Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Universal AI internal processing error' },
      { status: 500 }
    );
  }
}
