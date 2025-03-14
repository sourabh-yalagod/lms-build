"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGetCourseByIdQuery = exports.useGetCoursesQuery = void 0;
const react_1 = require("@reduxjs/toolkit/query/react/");
const customeBaseQuery = (args, api, extraOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const baseQuery = (0, react_1.fetchBaseQuery)({
        baseUrl: process.env.NEXT_PUBLIC_BASEURL,
        prepareHeaders: (header) => __awaiter(void 0, void 0, void 0, function* () {
            const token = yield User;
        }),
    });
});
const api = (0, react_1.createApi)({
    baseQuery: (0, react_1.fetchBaseQuery)({ baseUrl: process.env.NEXT_PUBLIC_BASEURL }),
    reducerPath: 'api',
    tagTypes: ['courses'],
    endpoints: (build) => ({
        getCourses: build.query({
            query: ({ category }) => ({ url: '/course', params: { category } }),
            providesTags: ['courses'],
        }),
        getCourseById: build.query({
            query: ({ id }) => ({
                url: `/course/${id}`,
                params: { courseId: id },
            }),
            providesTags: (result, error, id) => [{ type: 'courses', id }],
        }),
    }),
});
exports.useGetCoursesQuery = api.useGetCoursesQuery, exports.useGetCourseByIdQuery = api.useGetCourseByIdQuery;
