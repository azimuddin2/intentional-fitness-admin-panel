'use client';

import { useState } from 'react';
import { Trash2, ChevronDown, ChevronUp, Edit } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { TSurveyQuestion } from '@/src/types/surveyQuestion.type';

const typeIcon: Record<string, string> = {
  short_text: '📝',
  long_text: '📄',
  date: '📅',
  single_select: '🔘',
  multi_select: '☑️',
};

const typeLabel: Record<string, string> = {
  short_text: 'Short Text',
  long_text: 'Long Text',
  date: 'Date',
  single_select: 'Single Select',
  multi_select: 'Multi Select',
};

interface QuestionCardProps {
  q: TSurveyQuestion;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}

const QuestionCard = ({ q, index, onEdit, onDelete }: QuestionCardProps) => {
  const [showAll, setShowAll] = useState(false);

  const options = q.options || [];
  const visibleOptions = showAll ? options : options.slice(0, 4);
  const hasMore = options.length > 4;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 group">
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-1 text-xs font-semibold text-gray-400 mb-1">
            <span className="cursor-grab">⠿</span>
            QUESTION {index + 1}
          </div>

          <p className="font-medium text-[#212529] text-sm">{q.questionText}</p>

          <div className="flex gap-2 mt-2 items-center flex-wrap">
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 flex items-center gap-1">
              <span>{typeIcon[q.questionType]}</span>
              {typeLabel[q.questionType]}
            </span>

            {q.isRequired ? (
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-red-50 text-red-600">
                Required
              </span>
            ) : (
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">
                Optional
              </span>
            )}

            {options.length > 0 && (
              <span className="text-xs text-gray-400">
                {options.length} option{options.length > 1 ? 's' : ''}
              </span>
            )}
          </div>

          {options.length > 0 && (
            <div className="mt-3">
              <div className="flex flex-wrap gap-1.5">
                {visibleOptions.map((opt: string, i: number) => (
                  <span
                    key={i}
                    className="text-xs bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-md text-gray-600"
                  >
                    {opt}
                  </span>
                ))}
              </div>

              {hasMore && (
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="mt-1.5 flex items-center gap-1 text-xs text-[#1c3b4a] font-medium cursor-pointer"
                >
                  {showAll ? (
                    <>
                      Show less <ChevronUp size={12} />
                    </>
                  ) : (
                    <>
                      +{options.length - 4} more <ChevronDown size={12} />
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center flex-shrink-0 gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                render={
                  <button
                    onClick={onEdit}
                    className="rounded-md p-1.5 text-[#1c3b4a] bg-gray-100"
                  >
                    <Edit size={16} />
                  </button>
                }
              />
              <TooltipContent>Edit</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                render={
                  <button
                    onClick={onDelete}
                    className="rounded-md p-1.5 text-red-500 bg-red-50"
                  >
                    <Trash2 size={16} />
                  </button>
                }
              />
              <TooltipContent>Delete</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
