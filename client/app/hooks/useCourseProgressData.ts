import { useState } from 'react';
import { useParams } from 'next/navigation';
import {
  useGetCourseByIdQuery,
  useGetUserCourseProgressQuery,
  useUpdateCourseProgressMutation,
} from '@/state/api';
import { useUser } from '@clerk/nextjs';

export const useCourseProgressData = () => {
  const { courseId, chapterId } = useParams();
  const { user, isLoaded } = useUser();
  const [hasMarkedComplete, setHasMarkedComplete] = useState(false);
  const [updateCourseProgress] = useUpdateCourseProgressMutation();

  const { data: course, isLoading: courseLoading } = useGetCourseByIdQuery(
    {
      id: courseId,
    },
    { skip: !user?.id }
  );
  const { data: userProgress, isLoading: progressLoading } =
    useGetUserCourseProgressQuery(
      {
        userId: user?.id ?? '',
        courseId: (courseId as string) ?? '',
      },
      {
        skip: !isLoaded || !user || !courseId,
      }
    );

  const isLoading = !isLoaded || courseLoading || progressLoading;

  const currentSection = course?.sections.find((s: any) =>
    s.chapters.some((c: any) => c.chapterId === chapterId)
  );

  const currentChapter = currentSection?.chapters.find(
    (c: any) => c.chapterId === chapterId
  );

  const isChapterCompleted = () => {
    if (!currentSection || !currentChapter || !userProgress?.sections)
      return false;

    const section = userProgress.sections.find(
      (s: any) => s.sectionId === currentSection.sectionId
    );
    return (
      section?.chapters?.some(
        (c: any) => c.chapterId === currentChapter.chapterId && c.completed
      ) ?? false
    );
  };

  const updateChapterProgress = (
    sectionId: string,
    chapterId: string,
    completed: boolean
  ) => {
    if (!user) return;

    const updatedSections = [
      {
        sectionId,
        chapters: [
          {
            chapterId,
            completed,
          },
        ],
      },
    ];

    updateCourseProgress({
      userId: user.id,
      courseId: (courseId as string) ?? '',
      progressData: {
        sections: updatedSections,
      },
    });
  };

  return {
    user,
    courseId,
    chapterId,
    course,
    userProgress,
    currentSection,
    currentChapter,
    isLoading,
    isChapterCompleted,
    updateChapterProgress,
    hasMarkedComplete,
    setHasMarkedComplete,
  };
};
