import { useNavigate } from 'react-router-dom';
import { useQuizStore } from '../store/quizStore';
import { Play } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const restart = useQuizStore(state => state.restart);

  const startQuiz = () => {
    restart();
    navigate('/quiz');
  };

  return (
    <div className="glass-panel scale-in" style={{ textAlign: 'center' }}>
      <h1 className="gradient-text">QuizMaster Pro</h1>
      <p className="subtitle">Test your frontend knowledge with our advanced, time-pressured quiz.</p>
      
      <button className="btn btn-primary" onClick={startQuiz}>
        <Play size={24} />
        Start Quiz
      </button>
    </div>
  );
}
