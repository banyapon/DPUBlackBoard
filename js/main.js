// เริ่มต้น Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const likeListRef = database.ref('like');
const needListRef = database.ref('need');
const logLikeListRef = database.ref('log_like');
const logNeedListRef = database.ref('log_need');

// Variables for pagination
let likeItems = [];
let needItems = [];
let likeIndex = 0;
let needIndex = 0;
const itemsPerPage = 6;
const refreshInterval = 7500;

// Lightbox Alert Function to show message
function showAlert(message) {
    const alertBox = document.getElementById('alertLightbox');
    const alertMessage = document.getElementById('alertMessage');
    alertMessage.textContent = message;
    alertBox.style.display = 'block';
    setTimeout(() => {
        alertBox.style.opacity = '1';
        alertBox.style.transition = 'opacity 1s';
    }, 100);

    setTimeout(() => {
        alertBox.style.opacity = '0';
        setTimeout(() => alertBox.style.display = 'none', 1000);
    }, 5000);
}

// Function to display items in batches
function displayBatch(listElement, items, index) {
    listElement.innerHTML = '';
    const end = Math.min(index + itemsPerPage, items.length);
    for (let i = index; i < end; i++) {
        const li = document.createElement('li');
        li.textContent = items[i];
        listElement.appendChild(li);
    }
}

// Function to refresh lists every interval
function refreshLists() {
    displayBatch(document.getElementById('likeList'), likeItems, likeIndex);
    displayBatch(document.getElementById('needList'), needItems, needIndex);

    likeIndex = (likeIndex + itemsPerPage) % likeItems.length;
    needIndex = (needIndex + itemsPerPage) % needItems.length;
}

// Function to move excess items to log and delete them
function checkAndMoveExcessItems(ref, logRef, items) {
    if (items.length > 12) {
        const excessItems = items.slice(0, items.length - 12);
        excessItems.forEach((item) => {
            logRef.push(item);
        });

        // Delete moved items from the original reference
        const keysToDelete = [];
        ref.once('value').then(snapshot => {
            snapshot.forEach(childSnapshot => {
                if (excessItems.includes(childSnapshot.val())) {
                    keysToDelete.push(childSnapshot.key);
                }
            });
            keysToDelete.forEach(key => ref.child(key).remove());
        });
    }
}

// Function to reload data if there's a new entry
function reloadOnNewData(ref, itemsArray) {
    ref.on('child_added', (snapshot) => {
        const newItem = snapshot.val();
        itemsArray.push(newItem); // Add new item to the items array

        // Refresh displayed items with the new data
        refreshLists();

        // Optionally, reload the page (uncomment below if full page reload is needed)
        // location.reload();
    });
}

// Initial data loading and event listeners for real-time updates
reloadOnNewData(likeListRef, likeItems);
reloadOnNewData(needListRef, needItems);

// Fetch and update 'like' list from database
likeListRef.on('value', (snapshot) => {
    const newLikeItems = [];
    snapshot.forEach(childSnapshot => {
        newLikeItems.push(childSnapshot.val());
    });
    if (newLikeItems.length > likeItems.length) {
        const latestLike = newLikeItems[newLikeItems.length - 1];
        showAlert(`I LIKE: ${latestLike}`);
    }
    likeItems = newLikeItems;
    likeIndex = 0;
    refreshLists();
    checkAndMoveExcessItems(likeListRef, logLikeListRef, likeItems);
});

// Fetch and update 'need' list from database
needListRef.on('value', (snapshot) => {
    const newNeedItems = [];
    snapshot.forEach(childSnapshot => {
        newNeedItems.push(childSnapshot.val());
    });
    if (newNeedItems.length > needItems.length) {
        const latestNeed = newNeedItems[newNeedItems.length - 1];
        showAlert(`I NEED: ${latestNeed}`);
    }
    needItems = newNeedItems;
    needIndex = 0;
    refreshLists();
    checkAndMoveExcessItems(needListRef, logNeedListRef, needItems);
});

// Set interval to refresh lists every 7.5 seconds
setInterval(refreshLists, refreshInterval);
