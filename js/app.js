// เริ่มต้น Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// อ้างอิงไปยังโหนดในฐานข้อมูล
const likeListRef = database.ref('like');
const needListRef = database.ref('need');

// คำหยาบที่ต้องการกรอง
const badWords = ["ไอ้เหี้ย", "เหี้ย", "สัด", "ควย", "หี", "หำ", "ส้นตีน", "Fuck", "Fucking", "dick", "คยว","อีสัด","อีเหีย"];

// ฟังก์ชันตรวจสอบคำหยาบ
function containsBadWords(text) {
  return badWords.some(badWord => text.toLowerCase().includes(badWord.toLowerCase()));
}

// ฟังก์ชันสำหรับเพิ่มชื่อลงในฐานข้อมูล
function addLike() {
  const likeInput = document.getElementById('likeInput');
  const like_value = likeInput.value.trim();

  if (!like_value) {
    alert("กรุณาใส่ข้อความก่อนส่ง");
    return;
  }

  if (containsBadWords(like_value)) {
    alert("ข้อความของคุณมีคำไม่สุภาพ กรุณาแก้ไขก่อนส่ง");
    return;
  }

  // เพิ่มชื่อลงในฐานข้อมูล
  likeListRef.push(like_value);

  // ล้าง input field
  likeInput.value = '';
}

function addNeed() {
  const needInput = document.getElementById('needInput');
  const need_value = needInput.value.trim();

  if (!need_value) {
    alert("กรุณาใส่ข้อความก่อนส่ง");
    return;
  }

  if (containsBadWords(need_value)) {
    alert("ข้อความของคุณมีคำไม่สุภาพ กรุณาแก้ไขก่อนส่ง");
    return;
  }

  // เพิ่มชื่อลงในฐานข้อมูล
  needListRef.push(need_value);

  // ล้าง input field
  needInput.value = '';
}

// เพิ่ม Event Listener ให้กับปุ่ม
document.getElementById('addButtonLike').addEventListener('click', addLike);
document.getElementById('addButtonNeed').addEventListener('click', addNeed);

// ฟังก์ชันแสดงรายการ "Like"
function displayLikes(snapshot) {
  const likeList = document.getElementById('likeList');
  likeList.innerHTML = '';

  snapshot.forEach((childSnapshot) => {
    const name = childSnapshot.val();
    const li = document.createElement('li');
    li.textContent = name;
    likeList.appendChild(li);
  });
}

// ฟังก์ชันแสดงรายการ "Need"
function displayNeeds(snapshot) {
  const needList = document.getElementById('needList');
  needList.innerHTML = '';

  snapshot.forEach((childSnapshot) => {
    const name = childSnapshot.val();
    const li = document.createElement('li');
    li.textContent = name;
    needList.appendChild(li);
  });
}

// ดึงข้อมูลแบบ Real-time เมื่อมีการเปลี่ยนแปลงที่โหนด "like" และ "need"
likeListRef.on('value', displayLikes);
needListRef.on('value', displayNeeds);
