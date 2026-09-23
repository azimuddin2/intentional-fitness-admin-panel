'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Spinner from '@/src/components/shared/Spinner';
import { useGetSurveyByIdQuery } from '@/src/redux/features/survey/surveyApi';
import {
  useDeleteSurveyQuestionMutation,
  useGetQuestionsBySurveyQuery,
} from '@/src/redux/features/surveyQuestions/surveyQuestionApi';
import AddQuestionModal from './AddQuestionModal';
import UpdateQuestionModal from './UpdateQuestionModal';
import { TSurveyQuestion } from '@/src/types/surveyQuestion.type';
import QuestionCard from './QuestionCard';

const SurveyQuestions = () => {
  const router = useRouter();
  const { surveyId } = useParams();

  const { data: surveyData, isLoading: isSurveyLoading } =
    useGetSurveyByIdQuery(surveyId as string);

  const {
    data: questionsData,
    isLoading: isQuestionsLoading,
    refetch,
  } = useGetQuestionsBySurveyQuery(surveyId as string);

  const [deleteSurveyQuestion] = useDeleteSurveyQuestionMutation();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editQuestion, setEditQuestion] = useState<TSurveyQuestion | null>(
    null,
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const survey = surveyData?.data;
  const questions = questionsData?.data?.result || [];

  const handleDelete = async (id: string) => {
    try {
      await deleteSurveyQuestion(id).unwrap();
      toast.success('Question deleted successfully');
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to delete question');
    }
  };

  if (isSurveyLoading || isQuestionsLoading) {
    return <Spinner />;
  }

  return (
    <div>
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-sm text-gray-500 mb-4 hover:text-[#1c3b4a]"
      >
        <ChevronLeft size={16} /> Back to Surveys
      </button>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-xs text-gray-400 mb-1">
            Survey Management / {survey?.title}
          </p>
          <h2 className="text-xl font-semibold text-[#1c3b4a]">
            {survey?.title} — Questions
          </h2>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#1c3b4a] hover:bg-[#16303c] rounded cursor-pointer"
        >
          <Plus size={16} className="mr-1" /> Add Question
        </Button>
      </div>

      {/* Question Cards */}
      <div className="space-y-3">
        {questions?.map((q: TSurveyQuestion, index: number) => (
          <QuestionCard
            key={q._id}
            q={q}
            index={index}
            onEdit={() => {
              setEditQuestion(q);
              setIsEditModalOpen(true);
            }}
            onDelete={() => handleDelete(q._id)}
          />
        ))}

        {questions.length === 0 && (
          <div className="text-center py-16 text-gray-400 text-sm border border-dashed rounded-xl">
            No questions added yet. Click &quot;Add Question&quot; to get
            started.
          </div>
        )}
      </div>

      {/* 🔹 Add & Update Modals */}
      <AddQuestionModal
        surveyId={surveyId as string}
        isOpen={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSuccess={refetch}
      />

      <UpdateQuestionModal
        question={editQuestion}
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSuccess={refetch}
      />
    </div>
  );
};

export default SurveyQuestions;
