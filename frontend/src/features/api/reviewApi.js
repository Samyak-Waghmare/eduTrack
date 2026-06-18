import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { COURSE_API } from "@/lib/config";

export const reviewApi = createApi({
    reducerPath: "reviewApi",
    baseQuery: fetchBaseQuery({
        baseUrl: COURSE_API,
        credentials: "include"
    }),
    tagTypes: ["Reviews"],
    endpoints: (builder) => ({
        getCourseReviews: builder.query({
            query: (courseId) => ({
                url: `${courseId}/reviews`,
                method: "GET"
            }),
            providesTags: ["Reviews"]
        }),
        createOrUpdateReview: builder.mutation({
            query: ({ courseId, rating, comment }) => ({
                url: `${courseId}/review`,
                method: "POST",
                body: { rating, comment }
            }),
            invalidatesTags: ["Reviews"]
        }),
        deleteReview: builder.mutation({
            query: (courseId) => ({
                url: `${courseId}/review`,
                method: "DELETE"
            }),
            invalidatesTags: ["Reviews"]
        })
    })
});

export const {
    useGetCourseReviewsQuery,
    useCreateOrUpdateReviewMutation,
    useDeleteReviewMutation
} = reviewApi;
