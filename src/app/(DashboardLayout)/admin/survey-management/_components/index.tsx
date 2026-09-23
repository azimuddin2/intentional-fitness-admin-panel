'use client';

import { ColumnDef } from '@tanstack/react-table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Edit, Eye, Search, ShieldBan, ShieldCheck } from 'lucide-react';
import { format } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import {
  useGetAllSurveysQuery,
  useChangeSurveyStatusMutation,
} from '@/src/redux/features/survey/surveyApi';
import { toast } from 'sonner';
import { TSurvey } from '@/src/types/survey.type';
import Spinner from '@/src/components/shared/Spinner';
import { ADTable } from '@/src/components/modules/IFTable';
import ADPagination from '@/src/components/modules/IFPagination';
import AddSurveyModal from './AddSurveyModal';
import UpdateSurveyModal from './UpdateSurveyModal';

const SurveyManagement = () => {
  const [updateModalSurvey, setUpdateModalSurvey] = useState<TSurvey | null>(
    null,
  );
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  const [search, setSearch] = useState<string>(
    searchParams.get('searchTerm') || '',
  );

  const page = searchParams.get('page') || 1;
  const limit = searchParams.get('limit') || 20;
  const searchTerm = searchParams.get('searchTerm') || '';

  const { data, isLoading, refetch } = useGetAllSurveysQuery({
    page,
    limit,
    query: { searchTerm },
  });

  const surveys = data?.data || [];
  const meta = data?.meta;
  const totalPage = meta?.totalPage || 1;

  const updateSearchParams = useCallback(
    (newParams: Record<string, string | null | undefined>) => {
      const currentParams = new URLSearchParams(searchParams.toString());
      Object.entries(newParams).forEach(([key, value]) => {
        if (!value) {
          currentParams.delete(key);
        } else {
          currentParams.set(key, value);
        }
      });
      router.push(`?${currentParams.toString()}`);
    },
    [router, searchParams],
  );

  const handleSearch = () => {
    updateSearchParams({ searchTerm: search, page: '1' });
  };

  useEffect(() => {
    setSearch(searchParams.get('searchTerm') || '');
  }, [searchParams]);

  const [changeSurveyStatus] = useChangeSurveyStatusMutation();

  const handleToggleStatus = async (survey: TSurvey) => {
    const nextStatus = survey.status === 'active' ? 'inactive' : 'active';

    try {
      await changeSurveyStatus({
        id: survey._id,
        status: { status: nextStatus },
      }).unwrap();

      toast.success(
        nextStatus === 'inactive'
          ? 'Survey deactivated successfully'
          : 'Survey activated successfully',
      );
      refetch();
    } catch (error) {
      toast.error('Failed to update survey status');
    }
  };

  const columns: ColumnDef<TSurvey>[] = [
    {
      id: 'serial',
      header: 'Serial',
      cell: ({ row }) => (
        <span className="text-sm font-medium text-gray-500">
          {String(row.index + 1).padStart(2, '0')}
        </span>
      ),
    },
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => (
        <span className="font-medium text-[#212529]">{row.original.title}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const isActive = row.original.status === 'active';
        return (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
              isActive
                ? 'bg-green-50 text-green-600'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isActive ? 'bg-green-500' : 'bg-gray-400'
              }`}
            />
            {isActive ? 'Active' : 'Inactive'}
          </span>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Created Date',
      cell: ({ row }) => (
        <span className="text-sm text-gray-500">
          {format(new Date(row.original.createdAt), 'dd MMM, yyyy')}
        </span>
      ),
    },
    {
      accessorKey: 'action',
      header: 'Action',
      cell: ({ row }) => {
        const isActive = row.original.status === 'active';

        return (
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <button
                      onClick={() =>
                        router.push(
                          `/admin/survey-management/${row.original._id}`,
                        )
                      }
                      className="rounded-md p-1.5 text-[#1c3b4a] transition-colors bg-[#1c3b4a]/10 cursor-pointer"
                    >
                      <Eye size={18} />
                    </button>
                  }
                />
                <TooltipContent>View Questions</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <button
                      onClick={() => {
                        setUpdateModalSurvey(row.original);
                        setIsUpdateModalOpen(true);
                      }}
                      className="rounded-md p-1.5 text-blue-600 bg-blue-50 cursor-pointer"
                    >
                      <Edit size={18} />
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
                      type="button"
                      aria-label={isActive ? 'Deactivate' : 'Activate'}
                      onClick={() => handleToggleStatus(row.original)}
                      className={`rounded-md p-1.5 transition-colors cursor-pointer ${
                        isActive
                          ? 'text-[#FE5858] bg-red-50'
                          : 'text-green-600 bg-green-50'
                      }`}
                    >
                      {isActive ? (
                        <ShieldBan size={18} />
                      ) : (
                        <ShieldCheck size={18} />
                      )}
                    </button>
                  }
                />
                <TooltipContent>
                  {isActive ? 'Deactivate' : 'Activate'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      },
    },
  ];

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="">
      <div className="flex flex-col lg:justify-between lg:flex-row gap-4 mt-5 mb-5">
        <div className="relative w-full lg:w-3/5">
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search surveys..."
            className="border px-4 py-5 pr-12 rounded w-full"
          />
          <button
            onClick={handleSearch}
            className="absolute top-1/2 right-0 -translate-y-1/2 px-3 py-2 bg-[#1c3b4a] text-white rounded cursor-pointer"
          >
            <Search />
          </button>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-0 bg-[#1c3b4a] text-white rounded whitespace-nowrap"
        >
          Add Survey
        </button>
      </div>

      <ADTable columns={columns} data={surveys || []} />
      {surveys?.length > 0 && <ADPagination totalPage={totalPage} />}

      <AddSurveyModal
        isOpen={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSuccess={refetch}
      />

      <UpdateSurveyModal
        survey={updateModalSurvey}
        isOpen={isUpdateModalOpen}
        onOpenChange={setIsUpdateModalOpen}
        onSuccess={refetch}
      />
    </div>
  );
};

export default SurveyManagement;
