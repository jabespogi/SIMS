document.addEventListener('DOMContentLoaded', function() {
    const today = {
        day: 14,
        month: 4, 
        year: 2025
    };
    
    let currentDisplayMonth = today.month;
    let currentDisplayYear = today.year;
    
    const weeklyDays = document.querySelectorAll('.day');
    weeklyDays.forEach(day => {
        const dayNumber = parseInt(day.querySelector('.day-number').textContent);
        if (dayNumber === today.day) {
            day.classList.add('today');
        }
    });
    
    function addCalendarDayEvents() {
        const calendarDays = document.querySelectorAll('.month-table td');
        calendarDays.forEach(day => {
            if (!day.classList.contains('other-month')) {
                day.addEventListener('click', function() {
                    calendarDays.forEach(d => d.classList.remove('active'));
                    this.classList.add('active');
                    
                    const monthHeader = this.closest('.monthly-calendar').querySelector('.month-header h3').textContent;
                    
                    console.log(`Selected day: ${this.textContent} ${monthHeader}`);
                });
            }
        });
    }
    
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', function() {
            navigateMonth(-1);
        });
        
        nextBtn.addEventListener('click', function() {
            navigateMonth(1);
        });
    }
    
    function navigateMonth(direction) {
        currentDisplayMonth += direction;

        if (currentDisplayMonth > 11) {
            currentDisplayMonth = 0;
            currentDisplayYear++;
        } else if (currentDisplayMonth < 0) {
            currentDisplayMonth = 11;
            currentDisplayYear--;
        }
        
        const prevMonth = currentDisplayMonth - 1 < 0 ? 11 : currentDisplayMonth - 1;
        const prevYear = currentDisplayMonth - 1 < 0 ? currentDisplayYear - 1 : currentDisplayYear;
        
        const nextMonth = currentDisplayMonth + 1 > 11 ? 0 : currentDisplayMonth + 1;
        const nextYear = currentDisplayMonth + 1 > 11 ? currentDisplayYear + 1 : currentDisplayYear;
        
        const monthCalendars = document.querySelectorAll('.monthly-calendar');
        
        updateCalendarMonth(monthCalendars[0], prevMonth, prevYear);
        
        updateCalendarMonth(monthCalendars[1], currentDisplayMonth, currentDisplayYear);
        
        updateCalendarMonth(monthCalendars[2], nextMonth, nextYear);
        
        addCalendarDayEvents();
    }

    function updateCalendarMonth(calendarElement, month, year) {
        const monthHeader = calendarElement.querySelector('.month-header h3');
        monthHeader.textContent = `${getMonthName(month)} ${year}`;
        
        const calendarBody = calendarElement.querySelector('tbody');
        calendarBody.innerHTML = generateCalendar(year, month);
        
        if (month === today.month && year === today.year) {
            const todayCell = calendarBody.querySelector(`td:not(.other-month):nth-child(${(today.day % 7) || 7}):nth-of-type(${Math.ceil(today.day / 7)})`);
            if (todayCell) {
                todayCell.classList.add('active');
            }
        }
    }
    
    function getMonthName(monthIndex) {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return months[monthIndex];
    }
    
    weeklyDays.forEach(day => {
        day.addEventListener('dblclick', function() {
            const dayNumber = this.querySelector('.day-number').textContent;
            alert(`Add new event on day ${dayNumber}`);
        });
    });
    
    function generateCalendar(year, month) {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        
        let firstDayOfWeek = firstDay.getDay();
        firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
        
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        
        let calendarHTML = '';
        let dayCount = 1;
        let nextMonthDay = 1;
        
        for (let i = 0; i < 6; i++) {
            calendarHTML += '<tr>';
            
            for (let j = 0; j < 7; j++) {
                if (i === 0 && j < firstDayOfWeek) {
                    const prevDay = prevMonthLastDay - firstDayOfWeek + j + 1;
                    calendarHTML += `<td class="other-month">${prevDay}</td>`;
                } else if (dayCount > daysInMonth) {
                    calendarHTML += `<td class="other-month">${nextMonthDay}</td>`;
                    nextMonthDay++;
                } else {
                    let classes = '';
                    if (year === today.year && month === today.month && dayCount === today.day) {
                        classes = 'active';
                    }
                    calendarHTML += `<td class="${classes}">${dayCount}</td>`;
                    dayCount++;
                }
            }
            
            calendarHTML += '</tr>';
            if (dayCount > daysInMonth && i >= 4) {
                break;
            }
        }
        
        return calendarHTML;
    }
    addCalendarDayEvents();
});