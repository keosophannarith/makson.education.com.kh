function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
      .setTitle('ស្វាគមន៍មកកាន់ សាលាអន្តរជាតិ ម៉ាកសឹន')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}


function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
      .setTitle('Makson System')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

const SHEET_ID = "1noRLMkmppvPgy4S7dZGIR6uQsDrxyYhk9afyEFggi_E";

// សម្រាប់ចុះឈ្មោះ (Register)
function processSignUp(formData) {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheets()[0];
  sheet.appendRow([new Date(), formData.contact, formData.password]);
  return true;
}

// សម្រាប់ចូលប្រើ (Login)
function checkLogin(formData) {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheets()[0];
  var data = sheet.getDataRange().getValues();
  
  // ឆែកមើលគ្រប់ជួរក្នុង Sheet (Column B ជា Contact, Column C ជា Password)
  for (var i = 1; i < data.length; i++) {
    if (data[i][1] == formData.contact && data[i][2] == formData.password) {
      return true; // ឃើញទិន្នន័យ
    }
  }
  return false; // មិនឃើញទិន្នន័យ
}

// Function សម្រាប់បើកទំព័រកម្មវិធីដែលបានជ្រើសរើស
function selectProgram(programName) {
    // ១. លាក់ផ្ទាំង Dashboard ដើម
    document.getElementById('homepage').style.display = 'none';
    
    // ២. លាក់គ្រប់ផ្ទាំងកម្មវិធីផ្សេងៗ (ដើម្បីបង្ការការជាន់គ្នា)
    const allPages = document.querySelectorAll('.page-content');
    allPages.forEach(page => page.style.display = 'none');
    
    // ៣. បង្ហាញទំព័រដែលបានចុចជ្រើសរើស
    const targetPageId = 'page-' + programName;
    document.getElementById(targetPageId).style.display = 'flex';
    
    // បង្ហាញដំណឹងខ្លីៗ
    console.log("កំពុងចូលទៅកាន់: " + programName + " Programme");
}

// Function សម្រាប់ត្រឡប់មកកាន់ Dashboard វិញ
function showDashboard() {
    // ១. លាក់គ្រប់ផ្ទាំងកម្មវិធី
    const allPages = document.querySelectorAll('.page-content');
    allPages.forEach(page => page.style.display = 'none');
    
    // ២. បង្ហាញ Dashboard ដើមវិញ
    document.getElementById('homepage').style.display = 'flex';
}

function selectProgram(programName) {
    Swal.fire({
        title: 'អ្នកបានជ្រើសរើស',
        text: 'កំពុងចូលទៅកាន់៖ ' + programName + ' Programme',
        icon: 'info',
        confirmButtonColor: '#2a5298'
    });
    
    // នៅទីនេះ អ្នកអាចសរសេរកូដដើម្បីបើកផ្ទាំងតារាងពិន្ទុតាមកម្មវិធីនីមួយៗ
    console.log("Selected Program: " + programName);
}


function submitGrade(event, program) {
    event.preventDefault();
    const form = event.target;
    const btn = form.querySelector('button');
    
    btn.innerText = "កំពុងរក្សាទុក...";
    btn.disabled = true;

    // បញ្ជូនទិន្នន័យទៅកាន់ function saveScore ក្នុង Code.gs
    google.script.run
        .withSuccessHandler(function(res) {
            Swal.fire('ជោគជ័យ', 'ពិន្ទុត្រូវបានរក្សាទុកក្នុងផ្នែក ' + program, 'success');
            form.reset();
            btn.innerText = "រក្សាទុកពិន្ទុ";
            btn.disabled = false;
        })
        .saveScore(program, {
            name: form.studentName.value,
            subject: form.subject.value,
            score: form.score.value
        });
}

function saveScore(program, data) {
  const ss = SpreadsheetApp.openById("19UekgAnxKQO-t3JV_7R1En-PJxmKF6CCy76ZfZKXvUQ");
  
  // ជ្រើសរើស Tab ទៅតាមឈ្មោះកម្មវិធី (National, Chinese, International)
  const sheet = ss.getSheetByName(program);
  
  if (sheet) {
    sheet.appendRow([
      new Date(),     // កាលបរិច្ឆេទ
      data.name,      // ឈ្មោះសិស្ស
      data.subject,   // មុខវិជ្ជា
      data.score      // ពិន្ទុ
    ]);
    return "Saved";
  } else {
    throw new Error("រកមិនឃើញ Tab ឈ្មោះ " + program);
  }
}