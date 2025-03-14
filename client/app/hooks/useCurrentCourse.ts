'use client';
import { useGetCourseByIdQuery } from '@/state/api';
import { useSearchParams } from 'next/navigation';

export const useCurrentCourse = () => {
  const searchParams = useSearchParams();
  const courseId = searchParams.get('id') ?? '';
  const { data: course, error, ...rest } = useGetCourseByIdQuery({ id: courseId });
  return { course, courseId, ...rest };
};
