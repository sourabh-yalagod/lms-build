'use client';
import Header from '@/components/Headers';
import Loading from '@/components/Loading';
import TeacherCourseCard from '@/components/TeacherCourseCard';
import Toolbar from '@/components/Toolbar';
import { Button } from '@/components/ui/button';
import { useCreateCourseMutation, useGetCoursesQuery } from '@/state/api';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react';

const TeacherCoursePage = () => {
  const { data: courses, isLoading, error } = useGetCoursesQuery({});
  const { user } = useUser();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [createCourse] = useCreateCourseMutation();

  const handleCreateCourse = async () => {
    if (!user?.id) return;
    const { data } = await createCourse({
      teacherId: user.id,
      teacherName:
        user.firstName ||
        user.username ||
        user.emailAddresses[0].emailAddress ||
        'Unknown Teacher',
    });
    console.log('COURSE : ', data);

    if (data?.courseId) {
      router.push(`/teacher/courses/${data.courseId}`);
    }
  };
  const handleEdit = (courseId: string) => {
    router.push(`/teacher/courses/${courseId}`);
  };
  const handleDelete = () => {};

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

  if (isLoading) return <Loading />;
  if (error) return <div>Error: {JSON.stringify(error)}</div>;

  return (
    <div className="teacher-courses">
      <Header
        title="Courses"
        subtitle="Browse your courses"
        rightElement={
          <Button
            onClick={handleCreateCourse}
            className="teacher-courses__header"
          >
            Create Course
          </Button>
        }
      />
      <Toolbar
        onSearch={setSearchTerm}
        onCategoryChange={setSelectedCategory}
      />
      <div className="teacher-courses__grid">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course: Course) => (
            <TeacherCourseCard
              key={course.courseId}
              course={course}
              onEdit={() => handleEdit(course.courseId)}
              onDelete={handleDelete}
              isOwner={course.teacherId === user?.id}
            />
          ))
        ) : (
          <p className="text-center text-gray-500">No courses found.</p>
        )}
      </div>
    </div>
  );
};

export default TeacherCoursePage;
