// ฟังก์ชันสำหรับแสดง Post-it แบบกระจาย
function displayPostIt(items, listId, color) {
    const container = document.querySelector('.background');

    items.forEach((item, index) => {
      const postIt = document.createElement('div');
      postIt.className = 'post-it';
      postIt.textContent = item;
      postIt.style.backgroundColor = color;

      // สุ่มตำแหน่ง Post-it
      postIt.style.top = `${Math.floor(Math.random() * 80) + 10}vh`;
      postIt.style.left = `${Math.floor(Math.random() * 80) + 10}vw`;

      container.appendChild(postIt);
    });
  }

  // ดึงข้อมูลจาก Firebase และแสดงผลแบบ Post-it
  function loadDataAndDisplay() {
    const likeListRef = firebase.database().ref('like');
    const needListRef = firebase.database().ref('need');

    likeListRef.once('value', (snapshot) => {
      const likeItems = [];
      snapshot.forEach((childSnapshot) => {
        likeItems.push(childSnapshot.val());
      });
      displayPostIt(likeItems, 'likeList', '#f5f8fe');
    });

    needListRef.once('value', (snapshot) => {
      const needItems = [];
      snapshot.forEach((childSnapshot) => {
        needItems.push(childSnapshot.val());
      });
      displayPostIt(needItems, 'needList', '#ffda36');
    });
  }

  // เรียกใช้ฟังก์ชันโหลดข้อมูล
  loadDataAndDisplay();