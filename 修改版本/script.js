document.addEventListener('DOMContentLoaded', function() {
    // 生成日历 generrate 生成 calendar 日历/kælɪndər/
    function generateCalendar() {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        const monthNames = ["一月", "二月", "三月", "四月", "五月", "六月",
                            "七月", "八月", "九月", "十月", "十一月", "十二月"];

        let calendarHTML = `
            <table>
                <caption>${currentYear}年 ${monthNames[currentMonth]}</caption>
                <tr>
                    <th>日</th>
                    <th>一</th>
                    <th>二</th>
                    <th>三</th>
                    <th>四</th>
                    <th>五</th>
                    <th>六</th>
                </tr>
        `;

        let day = 1;
        for (let i = 0; i < 6; i++) {
            calendarHTML += '<tr>';
            for (let j = 0; j < 7; j++) {
                if (i === 0 && j < firstDay) {
                    calendarHTML += '<td></td>';
                } else if (day > daysInMonth) {
                    calendarHTML += '<td></td>';
                } else {
                    const isToday = day === now.getDate() ? ' class="today"' : '';
                    calendarHTML += `<td${isToday}>${day}</td>`;
                    day++;
                }
            }
            calendarHTML += '</tr>';
            if (day > daysInMonth) {
                break;
            }
        }

        calendarHTML += '</table>';
        document.getElementById('calendar').innerHTML = calendarHTML;
    }

    generateCalendar();

    // 菜单按钮点击事件
    document.getElementById('menuButton').addEventListener('click', function() {
        alert('菜单功能尚未实现');
    });

    // 为所有图标按钮添加点击事件
    const iconButtons = document.querySelectorAll('.icon-button');
    iconButtons.forEach(button => {
        button.addEventListener('click', function() {
            alert('该功能尚未实现');
        });
    });

    // 为应用图标添加点击事件
    const appItems = document.querySelectorAll('.app-item');
    appItems.forEach(item => {
        item.addEventListener('click', function() {
            const appName = this.querySelector('.app-name').textContent;
            alert(`您点击了 ${appName} 应用`);
        });
    });
});