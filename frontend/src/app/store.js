import {configureStore} from "@reduxjs/toolkit"
import rootReducer from "./rootReducer.js";
import { authApi } from "@/features/api/authApi.js";
import { courseApi } from "@/features/api/courseApi.js";
import { purchaseApi } from "@/features/api/purchaseApi.js";
import { courseProgressApi } from "@/features/api/courseProgressApi.js";
import { adminApi } from "@/features/api/adminApi.js";
import { reviewApi } from "@/features/api/reviewApi.js";
import { engagementApi } from "@/features/api/engagementApi.js";
import { analyticsApi } from "@/features/api/analyticsApi.js";
import { noteApi } from "@/features/api/noteApi.js";

export const appStore = configureStore({
    reducer: rootReducer,
    middleware: (defaultMiddleware) =>
        defaultMiddleware().concat(
            authApi.middleware,
            courseApi.middleware,
            purchaseApi.middleware,
            courseProgressApi.middleware,
            adminApi.middleware,
            reviewApi.middleware,
            engagementApi.middleware,
            analyticsApi.middleware,
            noteApi.middleware
        )
});