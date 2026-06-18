import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import { COURSE_API } from "@/lib/config";

export const courseApi = createApi({
    reducerPath: "courseApi",
    tagTypes: ["Refetch_Creator_Course", "Refetch_Lecture"],
    baseQuery: fetchBaseQuery({
        baseUrl: COURSE_API,
        credentials: 'include'
    }),
    endpoints: (builder) => ({
        createCourse: builder.mutation({
            query: ({title, category}) => ({
                url: "",
                method: "POST",
                body: {title, category}
            }),
            invalidatesTags: ["Refetch_Creator_Course"]
        }),
        getSearchCourse: builder.query({
            query: ({ searchQuery, categories, level, sortByPrice, page = 1 }) => {
                const params = new URLSearchParams()
                if (searchQuery) params.append("query", searchQuery)
                if (categories?.length) categories.forEach(c => params.append("categories", c))
                if (level?.length) level.forEach(l => params.append("level", l))
                if (sortByPrice) params.append("sortByPrice", sortByPrice)
                params.append("page", page)

                return {
                    url: `/search?${params.toString()}`,
                    method: "GET"
                }
            }
        }),
        getPublishedCourses: builder.query({
            query: () => ({
                url: "published-courses",
                method: "GET"
            })
        }),
        getCreatorCourses: builder.query({
            query: ({ page = 1, limit = 10 } = {}) => ({
                url: `?page=${page}&limit=${limit}`,
                method: "GET"
            }),
            providesTags: ["Refetch_Creator_Course"]
        }),
        editCourse: builder.mutation({
            query: ({formData, courseId}) => ({
                url: `/${courseId}`,
                method: "PUT",
                body: formData
            }),
            invalidatesTags: ["Refetch_Creator_Course"]
        }),
        getCourseById: builder.query({
            query: (courseId) => ({
                url: `/${courseId}`,
                method: "GET"
            })
        }),
        createLecture: builder.mutation({
            query: ({lectureTitle, courseId}) => ({
                url: `/${courseId}/lecture`,
                method: "POST",
                body: {lectureTitle}
            })
        }),
        getCourseLecture: builder.query({
            query: (courseId) => ({
                url: `/${courseId}/lecture`,
                method: "GET"
            }),
            providesTags: ["Refetch_Lecture"]
        }),
        editLecture: builder.mutation({
            query: ({courseId, lectureId, formData}) => ({
                url: `/${courseId}/lecture/${lectureId}`,
                method: "PUT",
                body: formData
            })
        }),
        removeLecture: builder.mutation({
            query: (lectureId) => ({
                url: `/lecture/${lectureId}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Refetch_Lecture"]
        }),
        getLectureById: builder.query({
            query: (lectureId) => ({
                url: `/lecture/${lectureId}`,
                method: "GET"
            })
        }),
        publishCourse: builder.mutation({
            query: ({courseId, query}) => ({
                url: `/${courseId}/publish?publish=${query}`,
                method: "PATCH"
            })
        }),
        uploadSubtitle: builder.mutation({
            query: ({courseId, lectureId, formData}) => ({
                url: `/${courseId}/lecture/${lectureId}/subtitle`,
                method: "POST",
                body: formData
            })
        }),
        getCloudinarySignature: builder.query({
            query: () => ({
                url: "/cloudinary-signature",
                method: "GET"
            })
        })
    })
})

export const {
    useCreateCourseMutation,
    useGetSearchCourseQuery,
    useGetPublishedCoursesQuery,
    useGetCreatorCoursesQuery,
    useEditCourseMutation,
    useGetCourseByIdQuery,
    useCreateLectureMutation,
    useGetCourseLectureQuery,
    useEditLectureMutation,
    useRemoveLectureMutation,
    useGetLectureByIdQuery,
    usePublishCourseMutation,
    useUploadSubtitleMutation,
    useGetCloudinarySignatureQuery,
    useLazyGetCloudinarySignatureQuery
} = courseApi;
