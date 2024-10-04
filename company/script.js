// 获取图标和主要内容元素
var menuIcon = document.getElementById("menuIcon");
var mainContent = document.querySelector(".main1");

// 定义点击事件处理函数
menuIcon.onclick = function() {
    if (mainContent.style.display === "none" || mainContent.style.display === "") {
        mainContent.style.display = "block"; // 显示内容
    } else {
        mainContent.style.display = "none"; // 隐藏内容
    }
}
