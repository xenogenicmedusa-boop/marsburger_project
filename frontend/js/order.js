// ========================================
// js/order.js
// MARS Burger Order API
// ========================================

const Order = {

    // API Base URL
    API_BASE: "http://localhost:3000/api",

    //----------------------------------------
    // 取得 JWT Token
    //----------------------------------------
    getToken() {
        return localStorage.getItem("mars_token");
    },

    //----------------------------------------
    // Authorization Header
    //----------------------------------------
    getHeaders() {
        return {
            Authorization: `Bearer ${this.getToken()}`
        };
    },

    //----------------------------------------
    // 我的訂單
    //----------------------------------------
    async getMyOrders() {

        const res = await axios.get(
            `${this.API_BASE}/user/orders`,
            {
                headers: this.getHeaders()
            }
        );

        return res.data.orders;
    },

    //----------------------------------------
    // 單筆訂單
    //----------------------------------------
    async getOrder(orderId) {

        const res = await axios.get(
            `${this.API_BASE}/orders/${orderId}`,
            {
                headers: this.getHeaders()
            }
        );

        return res.data.order;
    },

    //----------------------------------------
    // 建立訂單
    //----------------------------------------
    async createOrder(orderData) {

        const res = await axios.post(
            `${this.API_BASE}/orders`,
            orderData,
            {
                headers: this.getHeaders()
            }
        );

        return res.data;
    },

    //----------------------------------------
    // 更新訂單
    //----------------------------------------
    async updateOrder(orderId, orderData) {

        const res = await axios.put(
            `${this.API_BASE}/orders/${orderId}`,
            orderData,
            {
                headers: this.getHeaders()
            }
        );

        return res.data;
    },

    //----------------------------------------
    // 取消訂單
    //----------------------------------------
    async deleteOrder(orderId) {

        const res = await axios.delete(
            `${this.API_BASE}/orders/${orderId}`,
            {
                headers: this.getHeaders()
            }
        );

        return res.data;
    },

    //----------------------------------------
    // 訂單狀態
    //----------------------------------------
    async updateStatus(orderId, status) {

        const res = await axios.patch(
            `${this.API_BASE}/orders/${orderId}/status`,
            {
                status: status
            },
            {
                headers: this.getHeaders()
            }
        );

        return res.data;
    },

    //----------------------------------------
    // 重新取得訂單並更新 Vue
    //----------------------------------------
    async refresh(app) {

        try {

            app.userOrders = await this.getMyOrders();

        } catch (err) {

            console.error(err);

            if (
                err.response?.status === 401 ||
                err.response?.status === 403
            ) {

                Auth.logout(app);

            } else {

                alert("❌ 取得訂單失敗");

            }

        }

    },

    //----------------------------------------
    // 清空訂單
    //----------------------------------------
    clear(app) {

        app.userOrders = [];

    }

};