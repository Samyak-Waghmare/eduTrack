import { combineReducers } from "@reduxjs/toolkit"
import authReducer from "../features/authSlice.js"
import { authApi } from "@/features/api/authApi"
import { courseApi } from "@/features/api/courseApi"
import { purchaseApi } from "@/features/api/purchaseApi"
import { courseProgressApi } from "@/features/api/courseProgressApi"
import { adminApi } from "@/features/api/adminApi"
import { reviewApi } from "@/features/api/reviewApi"
import { engagementApi } from "@/features/api/engagementApi"
import { analyticsApi } from "@/features/api/analyticsApi"
import { noteApi } from "@/features/api/noteApi"

const rootReducer = combineReducers({
    [authApi.reducerPath]: authApi.reducer,
    [courseApi.reducerPath]: courseApi.reducer,
    [purchaseApi.reducerPath]: purchaseApi.reducer,
    [courseProgressApi.reducerPath]: courseProgressApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [reviewApi.reducerPath]: reviewApi.reducer,
    [engagementApi.reducerPath]: engagementApi.reducer,
    [analyticsApi.reducerPath]: analyticsApi.reducer,
    [noteApi.reducerPath]: noteApi.reducer,
    auth: authReducer
});

export default rootReducer;