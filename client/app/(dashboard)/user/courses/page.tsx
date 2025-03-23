'use client';
import Toolbar from '@/components/Toolbar';
import CourseCard from '@/components/CourseCard';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useState, useMemo } from 'react';
import Loading from '@/components/Loading';
import Header from '@/components/Headers';
import { useGetUserEnrollmentCourseQuery } from '@/state/api';

const Courses = () => {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const {
    data: courses,
    isLoading,
    isError,
  } = useGetUserEnrollmentCourseQuery(user?.id ?? '', {
    skip: !isLoaded || !user,
  });

  const filteredCourses = useMemo(() => {
    if (!courses) return [];

    return courses.filter((course: Course) => {
      const matchesSearch = course.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' || course.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [courses, searchTerm, selectedCategory]);

  const handleGoToCourse = (course: Course) => {
    const firstChapter = course.sections[0].chapters[0].chapterId;
    console.log('firstChapter : ', firstChapter);
    console.log('course : ', course);
    if (
      course.sections &&
      course.sections.length > 0 &&
      course.sections[0].chapters.length > 0
    ) {
      const firstChapter = course.sections[0].chapters[0];

      router.push(
        `/user/courses/${course.courseId}/chapters/${firstChapter.chapterId}`,
        {
          scroll: false,
        }
      );
    }
  };

  if (!isLoaded || isLoading) return <Loading />;
  if (!user) return <div>Please sign in to view your courses.</div>;
  if (isError || !courses || courses.length === 0)
    return <div>You are not enrolled in any courses yet.</div>;

  return (
    <div className="user-courses">
      <Header title="My Courses" subtitle="View your enrolled courses" />
      <Toolbar
        onSearch={setSearchTerm}
        onCategoryChange={setSelectedCategory}
      />
      <div className="user-courses__grid">
        {filteredCourses?.map((course: Course) => (
          <CourseCard
            key={course.courseId}
            course={course}
            onGoToCourse={handleGoToCourse}
          />
        ))}
      </div>
    </div>
  );
};

export default Courses;
