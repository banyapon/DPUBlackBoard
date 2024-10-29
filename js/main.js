// เริ่มต้น Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();


const likeListRef = firebase.database().ref('like');
const needListRef = firebase.database().ref('need');

// Variables for pagination
let likeItems = [];
let needItems = [];
let likeIndex = 0;
let needIndex = 0;
const itemsPerPage = 6;
const refreshInterval = 7500;

// Function to display items in batches of 3
function displayBatch(listElement, items, index) {
    listElement.innerHTML = '';
    const end = Math.min(index + itemsPerPage, items.length);
    for (let i = index; i < end; i++) {
        const li = document.createElement('li');
        li.textContent = items[i];
        listElement.appendChild(li);
    }
}

// Function to refresh lists every 3 seconds
function refreshLists() {
    displayBatch(document.getElementById('likeList'), likeItems, likeIndex);
    displayBatch(document.getElementById('needList'), needItems, needIndex);

    likeIndex = (likeIndex + itemsPerPage) % likeItems.length;
    needIndex = (needIndex + itemsPerPage) % needItems.length;
}

// Fetch and update 'like' list from database
likeListRef.on('value', (snapshot) => {
    likeItems = [];
    snapshot.forEach(childSnapshot => {
        likeItems.push(childSnapshot.val());
    });
    likeIndex = 0;
    refreshLists();
});

// Fetch and update 'need' list from database
needListRef.on('value', (snapshot) => {
    needItems = [];
    snapshot.forEach(childSnapshot => {
        needItems.push(childSnapshot.val());
    });
    needIndex = 0;
    refreshLists();
});

// Set interval to refresh lists every 3 seconds
setInterval(refreshLists, refreshInterval);