'use client';

import Loading from '@/components/Loading';
import { useGetCoursesQuery } from '@/state/api';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import CourseCard from '@/components/CourseCard';
import useCourseSelectRouter from '@/lib/useCourseSelectRouter';
import SelectedCourse from './SelectedCourse';

const Search = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const { data: courses = [], isError, isLoading } = useGetCoursesQuery({});
  const [course, setCourse] = useState<Course | null>(null);
  const router = useRouter();
  const { handleCourseSelect } = useCourseSelectRouter();
  useEffect(() => {
    if (courses.length) {
      if (id) {
        const foundCourse = courses.find((c) => c.courseId === id);
        setCourse(foundCourse || courses[0]);
      } else {
        setCourse(courses[0]);
      }
    }
  }, [courses, id]);

  if (isLoading) return <Loading />;
  if (isError) {
    return <div className="absolute inset-0 text-xl text-red-200">Got some Errors</div>;
  }
  const handleEnrollNow = (courseId: string) => {
    router.push(`/checkout?step=1&id=${courseId}&showSignUp=false`);
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-4"
    >
      <h1 className="text-2xl font-bold">List of available courses</h1>
      <h2 className="text-lg text-gray-600">{courses.length} courses available</h2>
      {course && <SelectedCourse course={course} handleEnrollNow={handleEnrollNow} key={1} />}
      <div className="mt-4 grid gap-4">
        {courses &&
          courses.map((c) => (
            <CourseCard key={c.courseId} course={c} onGoToCourse={handleCourseSelect} />
          ))}
      </div>
    </motion.div>
  );
};

export default Search;
