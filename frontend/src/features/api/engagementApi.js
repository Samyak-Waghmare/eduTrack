import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ENGAGEMENT_API } from "@/lib/config";

export const engagementApi = createApi({
    reducerPath: "engagementApi",
    baseQuery: fetchBaseQuery({
        baseUrl: ENGAGEMENT_API,
        credentials: "include"
    }),
    tagTypes: ["QA", "Quiz"],
    endpoints: (builder) => ({
        getQuestionsForLecture: builder.query({
            query: ({ courseId, lectureId }) => `/course/${courseId}/lecture/${lectureId}/qa`,
            providesTags: ["QA"]
        }),
        askQuestion: builder.mutation({
            query: ({ courseId, lectureId, content }) => ({
                url: `/course/${courseId}/lecture/${lectureId}/qa`,
                method: "POST",
                body: { content }
            }),
            invalidatesTags: ["QA"]
        }),
        replyToQuestion: builder.mutation({
            query: ({ questionId, content }) => ({
                url: `/qa/${questionId}/reply`,
                method: "POST",
                body: { content }
            }),
            invalidatesTags: ["QA"]
        }),
        getQuizForLecture: builder.query({
            query: ({ courseId, lectureId }) => `/course/${courseId}/lecture/${lectureId}/quiz`,
            providesTags: ["Quiz"]
        }),
        createOrUpdateQuiz: builder.mutation({
            query: ({ courseId, lectureId, questions }) => ({
                url: `/course/${courseId}/lecture/${lectureId}/quiz`,
                method: "POST",
                body: { questions }
            }),
            invalidatesTags: ["Quiz"]
        }),
        getInstructorQA: builder.query({
            query: () => `/instructor/qa`,
            providesTags: ["QA"]
        })
    })
});

export const {
    useGetQuestionsForLectureQuery,
    useAskQuestionMutation,
    useReplyToQuestionMutation,
    useGetQuizForLectureQuery,
    useCreateOrUpdateQuizMutation,
    useGetInstructorQAQuery
} = engagementApi;
