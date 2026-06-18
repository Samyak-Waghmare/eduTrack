import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { NOTE_API } from "@/lib/config";

export const noteApi = createApi({
    reducerPath: "noteApi",
    baseQuery: fetchBaseQuery({
        baseUrl: NOTE_API,
        credentials: "include"
    }),
    tagTypes: ["Note"],
    endpoints: (builder) => ({
        getNotesByLecture: builder.query({
            query: (lectureId) => `/${lectureId}`,
            providesTags: ["Note"]
        }),
        createNote: builder.mutation({
            query: ({ courseId, lectureId, timestamp, content }) => ({
                url: `/${courseId}/${lectureId}`,
                method: "POST",
                body: { timestamp, content }
            }),
            invalidatesTags: ["Note"]
        }),
        deleteNote: builder.mutation({
            query: (noteId) => ({
                url: `/${noteId}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Note"]
        })
    })
});

export const { useGetNotesByLectureQuery, useCreateNoteMutation, useDeleteNoteMutation } = noteApi;
