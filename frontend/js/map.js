// Google Map 導航表單互動
export function initMapNavigation() {
    const btnNavigate = document.getElementById("btnNavigate");
    const btnReset = document.getElementById("btnReset");
    const startAddressInput = document.getElementById("startAddress");
    const explorerNameInput = document.getElementById("explorerName");
    const formTitle = document.getElementById("formTitle");
    const cyberMap = document.getElementById("cyberMap");

    const targetAddress = "勞動部勞動力發展署中彰投分署";
    const defaultMapUrl = cyberMap?.src;

    if (btnNavigate) {
        btnNavigate.addEventListener("click", () => {
            const startLoc = startAddressInput.value.trim();
            const name = explorerNameInput.value.trim();

            if (!startLoc) {
                alert("💥 導航矩陣錯誤：請輸入您的『出發起點座標』以利規劃航線！");
                startAddressInput.focus();
                return;
            }

            formTitle.innerHTML = name 
                ? `🚀 指揮官 <span class="text-neon-pink">${name}</span> 的專屬取餐航線` 
                : `🚀 專屬取餐航線已同步`;

            cyberMap.src = `https://www.google.com/maps?saddr=${encodeURIComponent(startLoc)}&daddr=${encodeURIComponent(targetAddress)}&output=embed`;
        });
    }

    if (btnReset) {
        btnReset.addEventListener("click", () => {
            explorerNameInput.value = "";
            const phoneInput = document.getElementById("explorerPhone");
            if (phoneInput) phoneInput.value = "";
            startAddressInput.value = "";
            formTitle.innerText = "取餐星際航線規劃";
            cyberMap.src = defaultMapUrl;
        });
    }
}