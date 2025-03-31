import {
  BaseQueryApi,
  createApi,
  FetchArgs,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';

import { Clerk } from '@clerk/clerk-js';
import { User } from '@clerk/nextjs/server';

const customBaseQuery = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: any
) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: async (headers) => {
      const token = await window.Clerk?.session?.getToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  });
  try {
    const result: any = await baseQuery(args, api, extraOptions);
    console.log('🚀 ~ customBaseQuery ~ result:', result);
    if (result?.error) {
      console.log(result?.error);
      return { error: result.error };
    }
    if (result.data) {
      result.data = result?.data?.data;
    }
    return result;
  } catch (error: any) {
    console.error('Something went Wrong.....!');
    return { error: error };
  }
};
export const api = createApi({
  baseQuery: customBaseQuery,
  reducerPath: 'api',
  tagTypes: ['courses', 'user', 'transactions', 'userCourseProgress'],
  endpoints: (build) => ({
    getCourses: build.query<Course[], { category?: string }>({
      query: ({ category }) => ({ url: '/courses', params: { category } }),
      providesTags: ['courses'],
    }),
    getCourseById: build.query({
      query: ({ id }) => ({
        url: `/courses/${id}`,
        params: { courseId: id },
      }),
      providesTags: (result, error, id) => [{ type: 'courses', id }],
    }),
    userUpdate: build.mutation<User, Partial<User> & { userId: string }>({
      query: ({ userId, ...updatedUser }) => ({
        url: `/users/${userId}`,
        method: 'PUT',
        body: updatedUser,
      }),
      invalidatesTags: ['user'],
    }),
    createStripePaymentIntent: build.mutation<
      { clientSecrete: string },
      { amount: number }
    >({
      query: ({ amount }) => ({
        url: '/transactions/stripe/payment-intent',
        method: 'POST',
        body: { amount },
      }),
    }),
    createTransaction: build.mutation<Transaction, Partial<Transaction>>({
      query: (transaction) => ({
        url: '/transactions',
        body: transaction,
        method: 'POST',
      }),
      invalidatesTags: ['transactions', 'courses'],
    }),
    getUserTransactions: build.query<Transaction[], string>({
      query: (userId) => ({
        url: `/transactions/${userId}`,
        params: { userId },
      }),
      providesTags: ['transactions'],
    }),

    // --------------------------------------------------------------------------

    createCourse: build.mutation<
      Course,
      { teacherName: string; teacherId: string }
    >({
      query: ({ teacherName, teacherId }) => ({
        url: `courses`,
        method: 'POST',
        body: { teacherName, teacherId },
      }),
      invalidatesTags: ['courses'],
    }),

    updateCourse: build.mutation<
      Course,
      { courseId: string; formData: FormData }
    >({
      query: ({ courseId, formData }) => ({
        url: `/courses/${courseId}`,
        params: { courseId },
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (result, error, { courseId }) => [
        { type: 'courses', id: courseId },
      ],
    }),
    deleteCourse: build.mutation<{ message: string }, string>({
      query: (courseId) => ({
        url: `/courses/${courseId}`,
        method: 'DELETE',
        params: { courseId },
      }),
      invalidatesTags: ['courses'],
    }),

    // --------------------------------------------------------

    getUserEnrollmentCourse: build.query<Course[], string>({
      query: (userId) => ({
        url: `/progress/${userId}/enrolled-courses`,
        params: { userId },
      }),
    }),
    getUserCourseProgress: build.query({
      query: ({ userId, courseId }) => ({
        url: `progress/${userId}/courses/${courseId}`,
        params: { userId, courseId },
      }),
      providesTags: ['userCourseProgress'],
    }),
    updateCourseProgress: build.mutation({
      query: ({ userId, courseId, progressData }) => ({
        url: `progress/${userId}/courses/${courseId}`,
        method: 'POST',
        params: { userId, courseId },
        body: progressData,
      }),
      invalidatesTags: ['userCourseProgress'],
    }),
    // ------------------------------------------------------------

    getUploadVideoUrl: build.mutation<
      {
        uploadUrl: string;
        videoUrl: string;
      },
      {
        courseId: string;
        sectionId: string;
        chapterId: string;
        videoName: any;
        videoType: any;
      }
    >({
      query: ({ courseId, sectionId, chapterId, videoName, videoType }) => ({
        url: `/courses/${courseId}/sections/${sectionId}/chapters/${chapterId}/get-upload-url`,
        // /:courseId/sections/:sectionId/chapters/:chapterId/get-upload-url
        body: { videoName, videoType },
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useGetCourseByIdQuery,
  useUserUpdateMutation,
  useCreateStripePaymentIntentMutation,
  useCreateTransactionMutation,
  useGetUserTransactionsQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useGetUserEnrollmentCourseQuery,
  useDeleteCourseMutation,
  useUpdateCourseProgressMutation,
  useGetUserCourseProgressQuery,
  useGetUploadVideoUrlMutation,
} = api;
