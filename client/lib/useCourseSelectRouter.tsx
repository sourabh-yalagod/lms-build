'use client';

import { useRouter } from 'next/navigation';

const useCourseSelectRouter = () => {
  const router = useRouter();
  const handleCourseSelect = (courseId: string) => {
    router.push(`/search?id=${courseId}`);
  };
  return { handleCourseSelect };
};

export default useCourseSelectRouter;
