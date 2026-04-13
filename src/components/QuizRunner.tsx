import type { Question } from '@/lib/types';

type QuizRunnerProps = {
  currentIndex: number;
  question: Question;
  total: number;
  pickedId?: string;
  onPick: (optionId: string) => void;
};

export function QuizRunner({
  currentIndex,
  question,
  total,
  pickedId,
  onPick,
}: QuizRunnerProps) {
  const progress = Math.round(((currentIndex + 1) / total) * 100);

  return (
    <section className="quiz-panel" data-testid="quiz-runner">
      <div className="quiz-panel__eyebrow">
        <span>Question {currentIndex + 1}</span>
        <span>{progress}%</span>
      </div>
      <div className="progress-track" aria-hidden="true">
        <span className="progress-track__fill" style={{ width: `${progress}%` }} />
      </div>
      <h2 className="quiz-panel__title">{question.prompt}</h2>
      {question.context ? <p className="quiz-panel__context">{question.context}</p> : null}

      <div className="quiz-panel__options">
        {question.options.map((option) => (
          <button
            key={option.id}
            className={`answer-card ${pickedId === option.id ? 'is-picked' : ''}`}
            data-testid={`answer-${option.id}`}
            onClick={() => onPick(option.id)}
            type="button"
          >
            <span className="answer-card__index">{option.id.toUpperCase()}</span>
            <span>{option.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
