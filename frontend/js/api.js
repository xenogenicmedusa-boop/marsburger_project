/**
 * MarsBurger API Service
 * Author : MarsBurger Project
 * Version: 1.0
 */

const api = axios.create({
    baseURL: "http://localhost:3000/api",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json"
    }
});

/* =======================================================
   Request Interceptor
======================================================= */

api.interceptors.request.use(
    (config) => {

        const token = localStorage.getItem("mars_token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;

    },
    (error) => Promise.reject(error)
);


/* =======================================================
   Response Interceptor
======================================================= */

api.interceptors.response.use(

    (response) => response,

    (error) => {

        if (!error.response) {

            Swal.fire({
                icon: "error",
                title: "無法連線",
                text: "請確認 Node Server 是否已啟動"
            });

            return Promise.reject(error);
        }

        switch (error.response.status) {

            case 401:

                localStorage.removeItem("mars_token");
                localStorage.removeItem("mars_user");

                Swal.fire({
                    icon: "warning",
                    title: "登入已失效",
                    text: "請重新登入"
                });

                break;

            case 403:

                Swal.fire({
                    icon: "error",
                    title: "權限不足"
                });

                break;

            case 404:

                Swal.fire({
                    icon: "error",
                    title: "找不到資料"
                });

                break;

            case 500:

                Swal.fire({
                    icon: "error",
                    title: "Server Error",
                    text: "伺服器發生錯誤"
                });

                break;
        }

        return Promise.reject(error);

    }

);



/* =======================================================
   Auth API
======================================================= */

const AuthAPI = {

    register(data) {

        return api.post("/register", data);

    },

    login(data) {

        return api.post("/login", data);

    },

    getProfile() {

        return api.get("/user/profile");

    }

};



/* =======================================================
   Order API
======================================================= */

const OrderAPI = {

    getAll() {

        return api.get("/orders");

    },

    getMine() {

        return api.get("/user/orders");

    },

    create(data) {

        return api.post("/orders", data);

    },

    update(id, data) {

        return api.patch(`/orders/${id}`, data);

    },

    delete(id) {

        return api.delete(`/orders/${id}`);

    }

};



/* =======================================================
   Dashboard API
======================================================= */

const DashboardAPI = {

    getSummary() {

        return api.get("/dashboard");

    },

    getMealRank() {

        return api.get("/dashboard/meals");

    }

};



/* =======================================================
   Utils
======================================================= */

const TokenService = {

    save(token) {

        localStorage.setItem("mars_token", token);

    },

    get() {

        return localStorage.getItem("mars_token");

    },

    remove() {

        localStorage.removeItem("mars_token");

        localStorage.removeItem("mars_user");

    },

    saveUser(user) {

        localStorage.setItem(
            "mars_user",
            JSON.stringify(user)
        );

    },

    getUser() {

        const user = localStorage.getItem("mars_user");

        return user ? JSON.parse(user) : null;

    }

};



/* =======================================================
   Export
======================================================= */

window.api = api;

window.AuthAPI = AuthAPI;

window.OrderAPI = OrderAPI;

window.DashboardAPI = DashboardAPI;

window.TokenService = TokenService;