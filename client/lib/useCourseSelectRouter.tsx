'use client';

import { useRouter } from 'next/navigation';

const useCourseSelectRouter = () => {
  const router = useRouter();
  const handleCourseSelect = (course: Course) => {
    router.push(`/search?id=${course.courseId}`);
  };
  return { handleCourseSelect };
};

export default useCourseSelectRouter;
