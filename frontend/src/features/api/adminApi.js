import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ADMIN_API } from "@/lib/config";

export const adminApi = createApi({
    reducerPath: "adminApi",
    baseQuery: fetchBaseQuery({
        baseUrl: ADMIN_API,
        credentials: "include"
    }),
    tagTypes: ["User"],
    endpoints: (builder) => ({
        getAllUsers: builder.query({
            query: ({ page = 1, limit = 10 } = {}) => `users?page=${page}&limit=${limit}`,
            providesTags: ["User"]
        }),
        deleteUser: builder.mutation({
            query: (userId) => ({
                url: `users/${userId}`,
                method: "DELETE"
            }),
            invalidatesTags: ["User"]
        }),
        updateUserRole: builder.mutation({
            query: ({ userId, role }) => ({
                url: `users/${userId}/role`,
                method: "PATCH",
                body: { role }
            }),
            invalidatesTags: ["User"]
        }),
        getAdminAnalytics: builder.query({
            query: () => `analytics`,
        })
    })
});

export const {
    useGetAllUsersQuery,
    useDeleteUserMutation,
    useUpdateUserRoleMutation,
    useGetAdminAnalyticsQuery
} = adminApi;
