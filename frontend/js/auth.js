// ==============================
// js/auth.js
// MARS Burger Authentication
// ==============================

const Auth = {

    // -------------------------
    // 註冊
    // -------------------------
    async register(app) {

        if (!app.regAccount || !app.regPassword || !app.regEmail) {
            alert("💥 傳輸失敗：請填寫完整註冊欄位！");
            return;
        }

        if (app.regPassword !== app.regPasswordConfirm) {
            alert("💥 存取金鑰不吻合：請確認兩次輸入的密碼相同！");
            return;
        }

        if (!app.regAgree) {
            alert("💥 協議拒絕：必須同意《星際通訊協議條款》方可加入！");
            return;
        }

        try {

            const res = await axios.post(
                "http://localhost:3000/api/register",
                {
                    username: app.regAccount,
                    password: app.regPassword,
                    email: app.regEmail
                }
            );

            alert(res.data.message);

            // 清空表單
            app.regAccount = "";
            app.regPassword = "";
            app.regPasswordConfirm = "";
            app.regEmail = "";
            app.regAgree = false;

            // 關閉視窗
            const modal = bootstrap.Modal.getOrCreateInstance(
                document.getElementById("registerModal")
            );

            modal.hide();

        } catch (err) {

            alert(
                err.response?.data?.message ||
                "💥 矩陣連線失敗，註冊未完成"
            );

        }

    },

    // -------------------------
    // 登入
    // -------------------------
    async login(app) {

        if (!app.loginAccount || !app.loginPassword) {

            alert("💥 請輸入帳號與存取密碼！");
            return;

        }

        try {

            const res = await axios.post(
                "http://localhost:3000/api/login",
                {
                    account: app.loginAccount,
                    password: app.loginPassword
                }
            );

            localStorage.setItem(
                "mars_token",
                res.data.token
            );

            localStorage.setItem(
                "mars_user",
                JSON.stringify(res.data.user)
            );

            app.currentUser = res.data.user;

            app.loginAccount = "";
            app.loginPassword = "";

            const modal = bootstrap.Modal.getOrCreateInstance(
                document.getElementById("loginModal")
            );

            modal.hide();

            alert("🚀 身份驗證通過，歡迎連接 MARS-NET！");

            await Auth.fetchOrders(app);

        } catch (err) {

            alert(
                err.response?.data?.message ||
                "💥 驗證失敗：帳號或密碼錯誤"
            );

        }

    },

    // -------------------------
    // 我的訂單
    // -------------------------
    async fetchOrders(app) {

        const token = localStorage.getItem("mars_token");

        if (!token) return;

        try {

            const res = await axios.get(
                "http://localhost:3000/api/user/orders",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            app.userOrders = res.data.orders;

        } catch (err) {

            console.error(err);

            if (
                err.response?.status === 401 ||
                err.response?.status === 403
            ) {

                Auth.logout(app);

            }

        }

    },

    // -------------------------
    // 自動登入
    // -------------------------
    async checkLogin(app) {

        const token = localStorage.getItem("mars_token");

        if (!token) return;

        try {

            const res = await axios.get(
                "http://localhost:3000/api/user/profile",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            app.currentUser = res.data.user;

            await Auth.fetchOrders(app);

        } catch (err) {

            Auth.logout(app);

        }

    },

    // -------------------------
    // 登出
    // -------------------------
    logout(app) {

        localStorage.removeItem("mars_token");
        localStorage.removeItem("mars_user");

        app.currentUser = null;
        app.userOrders = [];

        alert("🛰️ 已斷開連線，安全返回地表！");

    },

    // -------------------------
    // Token
    // -------------------------
    getToken() {

        return localStorage.getItem("mars_token");

    },

    saveToken(token) {

        localStorage.setItem("mars_token", token);

    },

    removeToken() {

        localStorage.removeItem("mars_token");

    },

    // -------------------------
    // User
    // -------------------------
    getUser() {

        const user = localStorage.getItem("mars_user");

        if (!user) return null;

        return JSON.parse(user);

    },

    saveUser(user) {

        localStorage.setItem(
            "mars_user",
            JSON.stringify(user)
        );

    },

    removeUser() {

        localStorage.removeItem("mars_user");

    }

};