import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizStore } from '../store/quizStore';
import confetti from 'canvas-confetti';
import { RefreshCw, Trophy } from 'lucide-react';

export default function Result() {
  const { score, questions, restart } = useQuizStore();
  const navigate = useNavigate();
  const total = questions.length;
  const percentage = Math.round((score / total) * 100);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (percentage >= 50 && !hasAnimated) {
      setHasAnimated(true);
      const duration = 3 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#a855f7', '#ec4899', '#6366f1']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#a855f7', '#ec4899', '#6366f1']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      
      frame();
    }
  }, [percentage, hasAnimated]);

  const handleRetake = () => {
    restart();
    navigate('/');
  };

  return (
    <div className="glass-panel scale-in" style={{ textAlign: 'center' }}>
      <Trophy size={64} color="#ec4899" style={{ margin: '0 auto 1.5rem auto' }} />
      <h1 className="gradient-text">Quiz Complete!</h1>
      
      <div style={{ margin: '2rem 0' }}>
        <div style={{ fontSize: '4rem', fontWeight: 800 }}>
          {score} <span style={{ fontSize: '2rem', color: 'var(--text-muted)' }}>/ {total}</span>
        </div>
        <p className="subtitle" style={{ marginTop: '0.5rem', marginBottom: '0' }}>
          You scored {percentage}%. {percentage >= 80 ? 'Excellent work!' : percentage >= 50 ? 'Good job!' : 'Keep trying!'}
        </p>
      </div>

      <button className="btn btn-primary" onClick={handleRetake}>
        <RefreshCw size={24} />
        Retake Quiz
      </button>
    </div>
  );
}
