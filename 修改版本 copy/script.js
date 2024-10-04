// 获取模态框
var modal = document.getElementById("myModal");

// 获取图标
var icon = document.getElementById("myIcon");

// 获取 <span> 元素（关闭按钮）
var span = document.getElementsByClassName("close")[0];

// 点击图标时打开模态框
icon.onclick = function() {
    modal.style.display = "block";
}

// 点击 <span> 元素 (x)，关闭模态框
span.onclick = function() {
    modal.style.display = "none";
}

// 点击模态框外部时，关闭模态框
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
