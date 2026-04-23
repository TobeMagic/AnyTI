import { useEffect, useRef, useState } from 'react';
import type { Question } from '@/lib/types';

type QuizRunnerProps = {
  currentIndex: number;
  question: Question;
  total: number;
  pickedId?: string;
  onPick: (optionId: string) => void;
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
  isLast: boolean;
};

export function QuizRunner({
  currentIndex,
  question,
  total,
  pickedId,
  onPick,
  onPrev,
  onNext,
  canPrev,
  canNext,
  isLast,
}: QuizRunnerProps) {
  const progress = Math.round(((currentIndex + 1) / total) * 100);
  const contextParts = question.context
    ?.split('·')
    .map((part) => part.trim())
    .filter(Boolean);
  const contextBody = contextParts && contextParts.length > 1 ? contextParts.slice(1).join(' · ') : '';
  const [selectingId, setSelectingId] = useState<string | undefined>();
  const [isAdvancing, setIsAdvancing] = useState(false);
  const advanceTimerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    setSelectingId(undefined);
    setIsAdvancing(false);

    return () => {
      if (advanceTimerRef.current) {
        window.clearTimeout(advanceTimerRef.current);
      }
    };
  }, [question.id]);

  useEffect(() => {
    if (!selectingId || pickedId !== selectingId || isLast) {
      return;
    }

    advanceTimerRef.current = window.setTimeout(() => {
      onNext();
    }, 280);

    return () => {
      if (advanceTimerRef.current) {
        window.clearTimeout(advanceTimerRef.current);
      }
    };
  }, [isLast, onNext, pickedId, selectingId]);

  function handleOptionPick(optionId: string) {
    if (isAdvancing) return;

    onPick(optionId);

    if (isLast) {
      return;
    }

    setSelectingId(optionId);
    setIsAdvancing(true);
  }

  return (
    <section className={`quiz-panel quiz-panel--focus ${isAdvancing ? 'is-advancing' : ''}`} data-testid="quiz-runner">
      <div className="quiz-progress-row">
        <div className="progress-track" aria-hidden="true">
          <span className="progress-track__fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="quiz-progress-row__count" data-testid="quiz-progress">
          {currentIndex + 1} / {total}
        </span>
      </div>

      <div className="quiz-stage-card">
        <div className="quiz-stage-card__meta">
          <span className="quiz-stage-card__pill">第 {currentIndex + 1} 题</span>
          <span className="quiz-stage-card__ghost">维度已隐藏</span>
        </div>

        <div className="quiz-panel__prompt-wrap">
          {contextBody ? <p className="quiz-panel__context">{contextBody}</p> : null}
          <h2 className="quiz-panel__title">{question.prompt}</h2>
        </div>

        <div className="quiz-panel__options">
          {question.options.map((option) => (
            <button
              key={option.id}
              className={`answer-card answer-card--focus ${pickedId === option.id ? 'is-picked' : ''} ${selectingId === option.id ? 'is-selecting' : ''}`}
              data-testid={`answer-${option.id}`}
              disabled={isAdvancing}
              onClick={() => handleOptionPick(option.id)}
              type="button"
            >
              <span className="answer-card__index">{option.id.toUpperCase()}</span>
              <span className="answer-card__body">
                <strong className="answer-card__label">{option.label}</strong>
                {option.hint ? <small>{option.hint}</small> : null}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="quiz-nav quiz-nav--actions">
        <button className="ghost-button" data-testid="quiz-prev" disabled={!canPrev || isAdvancing} onClick={onPrev} type="button">
          上一题
        </button>
        <button className="primary-button" data-testid="quiz-next" disabled={!canNext || (!isLast && isAdvancing)} onClick={onNext} type="button">
          {isLast ? '提交并查看结果' : '下一题'}
        </button>
      </div>

      <p className="quiz-nav__status">请选择一个选项后继续</p>
    </section>
  );
}
