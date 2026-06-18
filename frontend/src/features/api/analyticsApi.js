import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ANALYTICS_API } from "@/lib/config";

export const analyticsApi = createApi({
    reducerPath: "analyticsApi",
    baseQuery: fetchBaseQuery({
        baseUrl: ANALYTICS_API,
        credentials: "include"
    }),
    endpoints: (builder) => ({
        getInstructorAnalytics: builder.query({
            query: () => "/",
        }),
    }),
});

export const { useGetInstructorAnalyticsQuery } = analyticsApi;
