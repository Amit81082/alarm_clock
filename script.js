document.addEventListener('DOMContentLoaded', function () {
    const timeEl = document.getElementById('time');
    const dateEl = document.getElementById('date');
    const toggleModeBtn = document.getElementById('toggle-mode');
    const toggleFormatBtn = document.createElement('button');
    const alarmSound = document.getElementById('alarm-sound');

    const hourSelect = document.getElementById('hour');
    const minuteSelect = document.getElementById('minute');
    const secondSelect = document.getElementById('second');
    const ampmSelect = document.getElementById('ampm');
    const setAlarmBtn = document.getElementById('set-alarm');
    const alarmsList = document.getElementById('alarms-list');

    let alarms = [];
    let is24HourFormat = false;

    toggleFormatBtn.innerText = '🕒 24H';
    toggleFormatBtn.id = 'toggle-format';
    document.querySelector('.clock').appendChild(toggleFormatBtn);

    function updateClock() {
        let now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        let seconds = now.getSeconds();
        let ampm = hours >= 12 ? 'PM' : 'AM';

        if (!is24HourFormat) {
            hours = hours % 12 || 12;
        }

        let timeString = is24HourFormat
            ? `${padZero(now.getHours())}:${padZero(minutes)}:${padZero(seconds)}`
            : `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)} ${ampm}`;
        timeEl.innerText = timeString;

        let dateString = now.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' });
        dateEl.innerText = dateString;

        checkAlarms(hours, minutes, seconds, ampm);
    }

    function padZero(num) {
        return num < 10 ? `0${num}` : num;
    }

    function populateDropdown(id, start, end) {
        let select = document.getElementById(id);
        for (let i = start; i <= end; i++) {
            let option = document.createElement('option');
            option.value = i;
            option.textContent = padZero(i);
            select.appendChild(option);
        }
    }

    function checkAlarms(hours, minutes, seconds, ampm) {
        alarms.forEach((alarm, index) => {
            if (alarm.enabled && alarm.hour == hours && alarm.minute == minutes && alarm.second == seconds && alarm.ampm == ampm) {
                alarmSound.src = "Alarm sound/extreme_alarm_clock.mp3";
                alarmSound.play();
                alarmSound.loop = true;

                alarms.splice(index, 1);
                updateAlarmList();
                showAlarmInterface();
            }
        });
    }

    function showAlarmInterface() {
        let existingOverlay = document.getElementById('alarm-overlay');
        if (existingOverlay) existingOverlay.remove();

        let overlay = document.createElement('div');
        overlay.id = "alarm-overlay";

        let stopButton = document.createElement('button');
        stopButton.id = "stop-alarm";
        stopButton.innerText = "Stop";

        let snoozeButton = document.createElement('button');
        snoozeButton.id = "snooze-alarm";
        snoozeButton.innerText = "Snooze";

        overlay.appendChild(stopButton);
        overlay.appendChild(snoozeButton);
        document.body.appendChild(overlay);

        stopButton.addEventListener('click', () => {
            alarmSound.pause();
            alarmSound.currentTime = 0;
            overlay.remove();
        });

        snoozeButton.addEventListener('click', () => {
            alarmSound.pause();
            alarmSound.currentTime = 0;
            overlay.remove();

            let now = new Date();
            now.setMinutes(now.getMinutes() + 5);

            let snoozeAlarm = {
                hour: now.getHours() % 12 || 12,
                minute: padZero(now.getMinutes()),
                second: padZero(now.getSeconds()),
                ampm: now.getHours() >= 12 ? 'PM' : 'AM',
                enabled: true
            };

            alarms.push(snoozeAlarm);
            updateAlarmList();
        });
    }

    function addAlarm() {
        let hour = hourSelect.value;
        let minute = minuteSelect.value;
        let second = secondSelect.value;
        let ampm = ampmSelect.value;

        let alarm = { hour, minute, second, ampm, enabled: true };
        alarms.push(alarm);
        updateAlarmList();
    }



    function updateAlarmList() {
        alarmsList.innerHTML = '';

        alarms.forEach((alarm, index) => {
            let alarmItem = document.createElement('div');
            alarmItem.classList.add("alarm-item");

            alarmItem.innerHTML = `
                <span class="alarm-time">${ padZero(alarm.hour)}:${padZero(alarm.minute)}:${padZero(alarm.second)} ${alarm.ampm}</span>

                <label class="switch">
                    <input type="checkbox" class="toggle-alarm" ${alarm.enabled ? "checked" : ""} data-index="${index}">
                    <span class="slider round"></span>
                </label>

                <button class="delete-alarm" data-index="${index}">🗑️</button>
            `;

            alarmsList.appendChild(alarmItem);
        });

        document.querySelectorAll('.toggle-alarm').forEach(switchBtn => {
            switchBtn.addEventListener('change', function () {
                let index = this.getAttribute('data-index');
                alarms[index].enabled = this.checked;
                console.log(`Alarm ${index} toggled: ${this.checked}`); // Debugging
            });
        });

        document.querySelectorAll('.delete-alarm').forEach(button => {
            button.addEventListener('click', function () {
                let index = this.getAttribute('data-index');
                alarms.splice(index, 1);
                updateAlarmList();
            });
        });
    }

    setAlarmBtn.addEventListener('click', addAlarm);

    toggleModeBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        toggleModeBtn.innerText = document.body.classList.contains('light-mode') ? '☀️' : '🌙';
    });

    toggleFormatBtn.addEventListener('click', () => {
        is24HourFormat = !is24HourFormat;
        toggleFormatBtn.innerText = is24HourFormat ? '🕑 12H' : '🕒 24H';
        updateClock();
    });

    setInterval(updateClock, 1000);
    populateDropdown('hour', 1, 12);
    populateDropdown('minute', 0, 59);
    populateDropdown('second', 0, 59);
});



