import { create } from 'zustand';

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  answers: number[];
  isFinished: boolean;
  timeRemaining: number;
  answerQuestion: (optionIndex: number) => void;
  nextQuestion: () => void;
  restart: () => void;
  tick: () => void;
  resetTimer: () => void;
}

const initialQuestions: Question[] = [
  {
    id: 1,
    text: "What does CSS stand for?",
    options: ["Cascading Style Sheets", "Computer Style Sheets", "Creative Style System", "Colorful Style Sheets"],
    correctAnswer: 0
  },
  {
    id: 2,
    text: "Which of the following is fundamentally a state management library for React?",
    options: ["React Router", "Zustand", "Vite", "Tailwind"],
    correctAnswer: 1
  },
  {
    id: 3,
    text: "What is the primary function of a bundler like Vite?",
    options: ["Write code automatically", "Compile and serve assets quickly", "Format code", "Manage state"],
    correctAnswer: 1
  },
  {
    id: 4,
    text: "Which hook is used to perform side effects in React?",
    options: ["useState", "useEffect", "useMemo", "useContext"],
    correctAnswer: 1
  },
  {
    id: 5,
    text: "What does API stand for in software engineering?",
    options: ["Application Programming Interface", "Advanced Program Integration", "Automated Process Interface", "Applied Protocol Information"],
    correctAnswer: 0
  }
];

export const useQuizStore = create<QuizState>((set) => ({
  questions: initialQuestions,
  currentQuestionIndex: 0,
  score: 0,
  answers: [],
  isFinished: false,
  timeRemaining: 15,
  answerQuestion: (optionIndex) => set((state) => {
    const isCorrect = state.questions[state.currentQuestionIndex].correctAnswer === optionIndex;
    const newScore = isCorrect ? state.score + 1 : state.score;
    const newAnswers = [...state.answers, optionIndex];
    
    // We auto-advance if it's the last question, or they can click next.
    // Let's just record the answer and let the UI call nextQuestion.
    return { score: newScore, answers: newAnswers };
  }),
  nextQuestion: () => set((state) => {
    const nextIndex = state.currentQuestionIndex + 1;
    if (nextIndex >= state.questions.length) {
      return { isFinished: true, currentQuestionIndex: state.currentQuestionIndex };
    }
    return { currentQuestionIndex: nextIndex, timeRemaining: 15 };
  }),
  restart: () => set({ currentQuestionIndex: 0, score: 0, answers: [], isFinished: false, timeRemaining: 15 }),
  tick: () => set((state) => {
    if (state.timeRemaining > 0) {
      return { timeRemaining: state.timeRemaining - 1 };
    }
    return state;
  }),
  resetTimer: () => set({ timeRemaining: 15 })
}));
