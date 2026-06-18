import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import { PURCHASE_API } from "@/lib/config";

export const purchaseApi = createApi({
    reducerPath: "purchaseApi",
    baseQuery: fetchBaseQuery({
        baseUrl: PURCHASE_API,
        credentials: 'include'
    }),
    endpoints: (builder) => ({
        createCheckoutSession: builder.mutation({
            query: (courseId) => ({
                url: "checkout/create-checkout-session",
                method: "POST",
                body: {courseId}
            })
        }),
        verifyPayment: builder.mutation({
            query: (sessionId) => ({
                url: "verify",
                method: "POST",
                body: {sessionId}
            })
        }),
        getCourseDetailWithStatus: builder.query({
            query: (courseId) => ({
                url: `course/${courseId}/detail-with-status`,
                method: "GET"
            })
        }),
        getMyPurchasedCourses: builder.query({
            query: () => ({
                url: "my-courses",
                method: "GET"
            })
        })
    })
})

export const {
    useCreateCheckoutSessionMutation,
    useVerifyPaymentMutation,
    useGetCourseDetailWithStatusQuery,
    useGetMyPurchasedCoursesQuery
} = purchaseApi;
