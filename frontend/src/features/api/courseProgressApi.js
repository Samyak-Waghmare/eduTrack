import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import { PROGRESS_API } from "@/lib/config";

export const courseProgressApi = createApi({
    reducerPath: "courseProgressApi",
    baseQuery: fetchBaseQuery({
        baseUrl: PROGRESS_API,
        credentials: 'include'
    }),
    endpoints: (builder) => ({
        getCourseProgress: builder.query({
            query: (courseId) => ({
                url: `/${courseId}`,
                method: "GET"
            })
        }),
        updateLectureProgress: builder.mutation({
            query: ({courseId, lectureId, viewed}) => ({
                url: `/${courseId}/lecture/${lectureId}/view`,
                method: "POST",
                body: {viewed}
            })
        }),
        markAsCompleted: builder.mutation({
            query: (courseId) => ({
                url: `/${courseId}/complete`,
                method: "POST"
            })
        }),
        markAsInCompleted: builder.mutation({
            query: (courseId) => ({
                url: `/${courseId}/incomplete`,
                method: "POST"
            })
        })
    })
})

export const {
    useGetCourseProgressQuery,
    useUpdateLectureProgressMutation,
    useMarkAsCompletedMutation,
    useMarkAsInCompletedMutation
} = courseProgressApi;
