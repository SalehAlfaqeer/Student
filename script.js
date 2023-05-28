let sName = document.getElementById("name"),
  amount = document.getElementById("amount"),
  studentSt = document.getElementById("status"),
  submit = document.getElementById("submit"),
  search = document.getElementById("search"),
  deleteAll = document.getElementById("deleteAll"),
  tBody = document.getElementById("tbody"),
  statusMode = "Empty",
  statusNum,
  updateMode = "create",
  temp,
  srchMode,
  warnMsg = document.getElementById("warnMsg"),
  warnText = document.getElementById("warnText"),
  warnBtn = document.getElementById("warnBtn");
//////////// Clear On load \\\\\\\\\\\\
function clearData() {
  sName.value = "";
  amount.value = "";
  sName.focus();
}
this.onload = function () {
  clearData();
  getStatus();
};

///////////////////== Warn Message ==\\\\\\\\\\\\\\\\\\\\\
warnBtn.onclick = function () {
  warnMsg.style.display = "none";
  sName.focus();
  startScroll();
};
///////////////////== Warn Message ==\\\\\\\\\\\\\\\\\\\\\

//////////// Stop Scroll \\\\\\\\\\\\
// first way to stop scrolling ↓↓↓↓
function stopScroll() {
  let scrollTop = window.pageXOffset,
    scrollLeft = window.pageYOffset;

  window.onscroll = function () {
    window.scrollTo(scrollTop, scrollLeft);
  };
}
function startScroll() {
  window.onscroll = function() {};
}
// those work now but need to run ↑↑↑

//////////// Get Status \\\\\\\\\\\\
function getStatus() {
  if (amount.value <= 50) {
    statusNum = amount.value + ",000";
    if (amount.value >= 20) {
      statusMode = "completed";
      // amount.value += "00";
      studentSt.style.background = " rgba(34, 120, 2, 0.815)";
    } else if (amount.value == "" || amount.value < 1) {
      statusMode = "empty";
      statusNum = "empty";
      studentSt.style.background = " rgba(150, 13, 4, 0.815)";
    } else {
      statusMode = "not complete";
      studentSt.style.background = "rgba(204, 157, 4, 0.918)";
    } //end first condetion
    studentSt.innerHTML = statusNum;
  } else {
    warnText.innerHTML = "You can't enter any value bigger than 50,000";
    warnMsg.style.display = "grid";
    warnBtn.focus();
    amount.value = "";
    getStatus();
    stopScroll();
  } // End second condetion
}

//////////// Create Student \\\\\\\\\\\\
let objStudent, arrStudent;
if (localStorage.storStudent != null) {
  arrStudent = JSON.parse(localStorage.storStudent);
} else {
  arrStudent = [];
}
submit.onclick = function () {
  objStudent = {
    sName: sName.value.toLowerCase(),
    amount: statusNum,
    studentSt: statusMode.toLowerCase(),
  };
  if (sName.value != "") {
    if (updateMode === "create") {
      arrStudent.push(objStudent);
    } else {
      arrStudent[temp] = objStudent;
      updateMode = "create";
      submit.innerHTML = updateMode;
    }
    clearData();
  } else {
    warnMsg.style.display = "grid";
    warnText.innerHTML = "Please enter student name!";
    warnBtn.focus();
    stopScroll();
  }
  localStorage.setItem("storStudent", JSON.stringify(arrStudent));

  //== Call Fun ==\\
  showStd();
  getStatus();
};

//////////// Show Students \\\\\\\\\\\\
function showStd() {
  let table = "";
  for (let i = 0; i < arrStudent.length; i++) {
    table += `
    <tr>
        <td>${i + 1}</td>
        <td>${arrStudent[i].sName.toUpperCase()}</td>
        <td>${arrStudent[i].amount}</td>
        <td>${arrStudent[i].studentSt.toUpperCase()}</td>
        <td><button onclick="updateStd(${i})" id="update">update</button></td>
        <td><button onclick="deleteStd(${i})" id="delete">delete</button></td>
     </tr>
    `;
  }
  tBody.innerHTML = table;

  if (arrStudent.length > 0) {
    deleteAll.innerHTML = `<button onclick='deleteAllFun()'> delete all (${arrStudent.length}) Student</button>`;
  } else {
    deleteAll.innerHTML = "";
  }
}
showStd();

//////////// Delete Student \\\\\\\\\\\\
function deleteStd(i) {
  arrStudent.splice(i, 1);
  localStorage.storStudent = JSON.stringify(arrStudent);

  //== Call Fun ==\\
  showStd();
}
function deleteAllFun() {
  localStorage.clear();
  arrStudent.splice(0);

  //== Call Fun ==\\
  showStd();
}

//////////// Update Student \\\\\\\\\\\\
function updateStd(i) {
  sName.value = arrStudent[i].sName;
  amount.value = arrStudent[i].amount.substr(0, 2);
  updateMode = "update";
  submit.innerHTML = updateMode;
  temp = i;
  sName.focus();
  scroll({
    top: 0,
    behavior: "smooth",
  });
  //== Call Fun ==\\
  getStatus();
}

//////////// Search Student \\\\\\\\\\\\
function getSearchMode(id) {
  if (id === "searchName") {
    srchMode = "Name";
  } else {
    srchMode = "Status";
  }
  search.value = "";
  search.placeholder = "Search by " + srchMode;
  search.focus();
  showStd();
}

function searchStd(value) {
  let table = "";
  for (let i = 0; i < arrStudent.length; i++) {
    if (srchMode === "Name") {
      if (arrStudent[i].sName.includes(value.toLowerCase())) {
        table += `
      <tr>
          <td>${i + 1}</td>
          <td>${arrStudent[i].sName.toUpperCase()}</td>
          <td>${arrStudent[i].amount}</td>
          <td>${arrStudent[i].studentSt.toUpperCase()}</td>
          <td><button onclick="updateStd(${i})" id="update">update</button></td>
          <td><button onclick="deleteStd(${i})" id="delete">delete</button></td>
       </tr>
      `;
      }
    } else {
      if (arrStudent[i].studentSt.includes(value.toLowerCase())) {
        table += `
      <tr>
          <td>${i + 1}</td>
          <td>${arrStudent[i].sName.toUpperCase()}</td>
          <td>${arrStudent[i].amount}</td>
          <td>${arrStudent[i].studentSt.toUpperCase()}</td>
          <td><button onclick="updateStd(${i})" id="update">update</button></td>
          <td><button onclick="deleteStd(${i})" id="delete">delete</button></td>
       </tr>
      `;
      }
    }
  } // End Loop

  tBody.innerHTML = table;
} // End Fun
