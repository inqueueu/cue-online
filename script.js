// List of all file IDs
const fileIds = [
    'art-folder', 'file1', 'file2', 'file3', 'file4', 'file5',
    'image1', 'video1', 'music', 'todo.txt', 'hidden_note'
];

// Track open files
const openFiles = new Set();

function openWindow(id) {
    const windowElement = document.getElementById(id);
    if (!windowElement) return;

    // Only set position if the window is not already visible
    if (windowElement.style.display !== 'flex') {
        // Get viewport size
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        // Set random position, keeping the window inside the viewport
        const left = Math.floor(Math.random() * (vw - 400)); // 400 = approx window width
        const top = Math.floor(Math.random() * (vh - 300));  // 300 = approx window height
        windowElement.style.left = left + 'px';
        windowElement.style.top = top + 'px';
    }

    windowElement.style.display = 'flex';
    windowElement.style.zIndex = 2001; // bring to front

    // Add the file to the openFiles set
    if (fileIds.includes(id)) {
        openFiles.add(id);
    }

    // Check if all files are open
    if (fileIds.every(fileId => openFiles.has(fileId))) {
        let newWindow = open('/', 'example', 'width=300,height=300')
        newWindow.focus();

        alert(newWindow.location.href); // (*) about:blank, loading hasn't started yet

        newWindow.onload = function () {
            let html = `<div style="font-size:30px">Welcome!</div>`;
            newWindow.document.body.insertAdjacentHTML('afterbegin', html);
        };
    }

    renderTaskbarItems();
}

function closeWindow(id) {
    const windowElement = document.getElementById(id);
    if (!windowElement) return;

    windowElement.style.display = 'none';
    openFiles.delete(id);
    renderTaskbarItems();
}

function renderTaskbarItems() {
    const container = document.getElementById('taskbar-items');
    container.innerHTML = '';
    openFiles.forEach(id => {
        // Use the window's header or fallback to id
        const win = document.getElementById(id);
        let label = id;
        if (win) {
            const header = win.querySelector('.window-header span');
            if (header && header.textContent) label = header.textContent;
        }
        const btn = document.createElement('button');
        btn.className = 'taskbar-item';
        btn.textContent = label;
        btn.onclick = () => {
            openWindow(id);
        };
        container.appendChild(btn);
    });
}

function openWindowWithPassword(id, password) {
    // Show the password prompt modal
    const passwordPrompt = document.getElementById('password-prompt');
    passwordPrompt.style.display = 'flex'; // <-- This line is needed!
    passwordPrompt.dataset.fileId = id;
    passwordPrompt.dataset.password = password;

    // Clear previous error and input
    document.getElementById('password-error').textContent = '';
    document.getElementById('password-input').value = '';
}

function submitPassword(id, correctPassword) {
    const passwordInput = document.getElementById('password-input');
    const enteredPassword = passwordInput.value;

    if (enteredPassword === correctPassword) {
        const windowElement = document.getElementById(id);
        const contentElement = document.getElementById(`${id}-content`);
        if (contentElement) contentElement.style.display = 'block';
        if (windowElement) windowElement.style.display = 'flex';
        closePasswordPrompt();
    } else {
        alert('Incorrect password. Please try again.');
        passwordInput.value = '';
        passwordInput.focus();
    }
}

function closePasswordPrompt() {
    // Hide the password prompt modal
    const passwordPrompt = document.getElementById('password-prompt');
    passwordPrompt.style.display = 'none';

    // Clear the input field and error message
    const passwordInput = document.getElementById('password-input');
    passwordInput.value = '';
    const errorDiv = document.getElementById('password-error');
    errorDiv.textContent = '';
}

// Ensure all windows are hidden on page load
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.window').forEach(windowElement => {
        windowElement.style.display = 'none'; // Hide all windows
    });
});


// Enable dragging for elements with the data-drag-handle attribute
document.querySelectorAll('[data-drag-handle]').forEach(handle => {
    const windowElement = handle.closest('.window');
    let offsetX = 0, offsetY = 0, isDragging = false;

    handle.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - windowElement.offsetLeft;
        offsetY = e.clientY - windowElement.offsetTop;
        windowElement.style.position = 'absolute'; // Ensure position is absolute
        windowElement.style.zIndex = '1000'; // Bring to front
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            windowElement.style.left = `${e.clientX - offsetX}px`;
            windowElement.style.top = `${e.clientY - offsetY}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
});

const timeDiv = document.getElementById("time");

function updateTime() {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString();
    timeDiv.textContent = formattedTime;
}

setInterval(updateTime, 1000);

// ===== IMAGE WINDOW HANDLER ===== //
function openImageWindow(imageSrc, windowId, title, caption) {
    // Check if window already exists
    let window = document.getElementById(windowId);

    if (!window) {
        // Create new image window if it doesn't exist
        window = document.createElement('div');
        window.className = 'window image-window';
        window.id = windowId;
        window.innerHTML = `
            <div class="window-header" data-drag-handle>
                <span>${title}</span>
                <button class="close-btn" onclick="closeWindow('${windowId}')">X</button>
            </div>
            <div class="window-content">
                <img src="${imageSrc}" alt="${title}" class="displayed-image">
                <p class="image-caption">${caption}</p>
            </div>
        `;
        document.body.appendChild(window);
        setupDraggableWindow(window); // Reuse your existing drag function
    }

    // Display and bring to front
    window.style.display = 'block';
    bringToFront(window);
}

var loadingScreen = document.querySelector(".loadingScreen");

window.addEventListener('load', function () {
    // Keep the loading screen visible for 2 seconds
    setTimeout(() => {
        loadingScreen.style.display = 'none';
    }, 2000); // 2000 milliseconds = 2 seconds
});

function submitPasswordFromPrompt() {
    
    const passwordPrompt = document.getElementById('password-prompt');
    const id = passwordPrompt.dataset.fileId;
    const correctPassword = passwordPrompt.dataset.password;
    console.log('Trying to unlock:', id, 'with password:', correctPassword);
    submitPassword(id, correctPassword);
}

function playSong(src, title) {
    var audio = document.getElementById('playlist-audio');
    var source = audio.querySelector('source');
    source.src = src;
    audio.load();
    audio.play();
    document.getElementById('now-playing').textContent = 'Now Playing: ' + title + ' 🎵';
}

function showAboutTab(tabId) {
    // Hide all tab contents
    document.querySelectorAll('#file1 .tab-content').forEach(tab => {
        tab.style.display = 'none';
    });
    // Remove active class from all buttons
    document.querySelectorAll('#file1 .tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    // Show selected tab and set button active
    document.getElementById(tabId).style.display = 'block';
    const btnIndex = tabId === 'about-this' ? 0 : 1;
    document.querySelectorAll('#file1 .tab-btn')[btnIndex].classList.add('active');
}

function showArtTab(tabId) {
    document.querySelectorAll('#art-folder .tab-content').forEach(tab => {
        tab.style.display = 'none';
    });
    document.querySelectorAll('#art-folder .tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(tabId).style.display = 'block';
    // Set active button
    const btns = Array.from(document.querySelectorAll('#art-folder .tab-btn'));
    const tabNames = ['sketches', 'unfinished', 'completed'];
    btns[tabNames.indexOf(tabId)].classList.add('active');
}

function toggleStartMenu() {
    const menu = document.getElementById('startMenu');
    menu.style.display = (menu.style.display === 'flex') ? 'none' : 'flex';
    // Optional: close menu if you click outside
    document.addEventListener('click', function handler(e) {
        if (!menu.contains(e.target) && !e.target.classList.contains('dropbtn')) {
            menu.style.display = 'none';
            document.removeEventListener('click', handler);
        }
    });
}

document.getElementById('startBtn').addEventListener('click', function(e) {
    e.stopPropagation();
    const dropup = this.parentElement;
    dropup.classList.toggle('open');
});

// Optional: close menu when clicking outside
document.addEventListener('click', function(e) {
    document.querySelectorAll('.dropup.open').forEach(dropup => {
        if (!dropup.contains(e.target)) {
            dropup.classList.remove('open');
        }
    });
});

function emptyRecycleBin() {
    const bin = document.getElementById('recycle-bin-files');
    bin.innerHTML = '<div style="grid-column: 1 / -1; text-align:center; color:#888;"><em>The Recycle Bin is empty.</em></div>';
    // Change the recycle bin icon to empty
    const binIcon = document.getElementById('recycle-bin-icon');
    if (binIcon) binIcon.src = 'images/recycle_bin_empty.png';
}