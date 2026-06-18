import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import { userLoggedIn, userLoggedOut } from "../authSlice.js"
import { USER_API } from "@/lib/config";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: USER_API,
        credentials: 'include'
    }),
    endpoints: (builder) => ({
        registerUser: builder.mutation({
            query: (inputData) => ({
                url: "register",
                method: "POST",
                body:inputData
            })
        }),
        loginUser: builder.mutation({
            query: (inputData) => ({
                url: "login",
                method: "POST",
                body:inputData
            }),
            async onQueryStarted(_, {queryFulfilled, dispatch}){
                try {
                    const result = await queryFulfilled;
                    dispatch(userLoggedIn({user: result.data.user}))
                } catch (error) {

                }
            }
        }),
        logoutUser: builder.mutation({
            query: () => ({
                url: "logout",
                method: "GET"
            }),
            async onQueryStarted(_, {queryFulfilled, dispatch}){
                try {
                    await queryFulfilled;
                    dispatch(userLoggedOut())
                } catch (error) {

                }
            }
        }),
        loadUser: builder.query({
            query: () => ({
                url: "profile",
                method: "GET"
            }),
            async onQueryStarted(_, {queryFulfilled, dispatch}){
                try {
                    const result = await queryFulfilled;
                    dispatch(userLoggedIn({user: result.data.user}))
                } catch (error) {

                }
            }
        }),
        updateUser: builder.mutation({
            query: (formData) => ({
                url: "profile/update",
                method: "PUT",
                body: formData
            })
        }),
        getLeaderboard: builder.query({
            query: () => ({
                url: "leaderboard",
                method: "GET"
            })
        }),
        getUserPortfolio: builder.query({
            query: (userId) => ({
                url: `portfolio/${userId}`,
                method: "GET"
            })
        })
    })
})

export const {
    useRegisterUserMutation,
    useLoginUserMutation,
    useLogoutUserMutation,
    useLoadUserQuery,
    useUpdateUserMutation,
    useGetLeaderboardQuery,
    useGetUserPortfolioQuery
} = authApi;
