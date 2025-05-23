// List of all file IDs
const fileIds = ['file1', 'file2', 'file3', 'file4'];

// Track open files
const openFiles = new Set();

function openWindow(id) {
    const windowElement = document.getElementById(id);
    if (!windowElement) return; // Ensure the element exists
    windowElement.style.display = 'flex';

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

    // Add the file to the taskbar if not already present
    const taskbarItems = document.querySelector('.taskbar-items');
    if (!document.getElementById(`taskbar-${id}`)) {
        const taskbarItem = document.createElement('div');
        taskbarItem.id = `taskbar-${id}`;
        taskbarItem.className = 'taskbar-item';
        taskbarItem.textContent = id; // Display the window ID in the taskbar
        taskbarItem.onclick = () => {
            windowElement.style.display = 'flex';
        };
        taskbarItems.appendChild(taskbarItem);
    }
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

function closeWindow(id) {
    const windowElement = document.getElementById(id);
    if (windowElement) {
        windowElement.style.display = 'none';
    }

    // Remove the file from the openFiles set
    openFiles.delete(id);

    // Remove the file from the taskbar
    const taskbarItem = document.getElementById(`taskbar-${id}`);
    if (taskbarItem) {
        taskbarItem.remove();
    }
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

