import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizStore } from '../store/quizStore';
import { Clock } from 'lucide-react';

export default function Quiz() {
  const { 
    questions, 
    currentQuestionIndex, 
    timeRemaining, 
    tick, 
    answerQuestion, 
    nextQuestion,
    isFinished
  } = useQuizStore();
  
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const question = questions[currentQuestionIndex];
  const isAnswered = selectedOption !== null;

  useEffect(() => {
    if (isFinished) {
      navigate('/result');
      return;
    }

    if (isAnswered) return;

    const interval = setInterval(() => {
      tick();
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining, isAnswered, tick, isFinished, navigate]);

  useEffect(() => {
    if (timeRemaining === 0 && !isAnswered) {
      // Auto submit with a wrong index when time runs out
      answerQuestion(-1);
      setTimeout(() => {
        setSelectedOption(null);
        nextQuestion();
      }, 1500);
    }
  }, [timeRemaining, isAnswered, answerQuestion, nextQuestion]);

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    
    setSelectedOption(index);
    answerQuestion(index);
    
    // Auto advance after 1.5s delay to show correct/wrong state
    setTimeout(() => {
      setSelectedOption(null);
      nextQuestion();
    }, 1500);
  };

  if (!question) return null;

  const progress = ((currentQuestionIndex) / questions.length) * 100;

  return (
    <div className="glass-panel slide-up" style={{ animationDelay: '0.1s' }}>
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>
      
      <div className="quiz-header">
        <span className="question-meta">Question {currentQuestionIndex + 1} of {questions.length}</span>
        <div className={`timer-box ${timeRemaining <= 5 && !isAnswered ? 'timer-pulse' : ''}`}>
          <Clock size={20} style={{ marginRight: '8px' }} />
          <span>0:{timeRemaining.toString().padStart(2, '0')}</span>
        </div>
      </div>

      <h2>{question.text}</h2>

      <div className="options-grid">
        {question.options.map((option, index) => {
          let className = 'option-btn';
          if (isAnswered) {
            if (index === question.correctAnswer) {
              className += ' correct';
            } else if (index === selectedOption) {
              className += ' wrong';
            }
          }
          return (
            <button 
              key={index}
              className={className}
              onClick={() => handleOptionClick(index)}
              disabled={isAnswered || timeRemaining === 0}
            >
              <span>{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
