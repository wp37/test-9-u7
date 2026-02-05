/**
 * ╔════════════════════════════════════════════════════════════════════════╗
 * ║           GOOGLE APPS SCRIPT - QUIZ GLOBAL SUCCESS 9                   ║
 * ║                    Unit 7: Natural Wonders of the World                ║
 * ╚════════════════════════════════════════════════════════════════════════╝
 * 
 * HƯỚNG DẪN SỬ DỤNG:
 * 1. Tạo Google Sheets mới
 * 2. Vào Extensions > Apps Script
 * 3. Xóa code mặc định, dán code này vào
 * 4. Nhấn Deploy > New deployment > Web app
 * 5. Execute as: Me, Who has access: Anyone
 * 6. Copy URL và dán vào GOOGLE_SCRIPT_URL trong file HTML
 */

// ═══════════════════════════════════════════════════════════════════
// CẤU HÌNH - Tên sheet để lưu kết quả
// ═══════════════════════════════════════════════════════════════════
const SHEET_NAME = "Unit 7 - Natural Wonders";

// ═══════════════════════════════════════════════════════════════════
// HÀM XỬ LÝ REQUEST POST TỪ QUIZ
// ═══════════════════════════════════════════════════════════════════
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = getOrCreateSheet(SHEET_NAME);
    
    // Thời gian nộp bài (múi giờ Việt Nam)
    const timestamp = Utilities.formatDate(new Date(), "Asia/Ho_Chi_Minh", "dd/MM/yyyy HH:mm:ss");
    
    // Thêm dữ liệu vào sheet
    sheet.appendRow([
      timestamp,                              // A: Thời gian nộp
      data.name || "",                        // B: Họ tên
      data.className || "",                   // C: Lớp
      data.parentPhone || "",                 // D: SĐT phụ huynh
      data.score || "0",                      // E: Điểm
      data.correctCount || "0",               // F: Số câu đúng
      data.totalQuestions || "20",            // G: Tổng số câu
      data.timeUsed || "00:00",               // H: Thời gian làm bài
      calculatePercentage(data.correctCount, data.totalQuestions), // I: Tỷ lệ %
      getGrade(parseFloat(data.score || "0")) // J: Xếp loại
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", message: "Đã lưu kết quả!" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ═══════════════════════════════════════════════════════════════════
// HÀM XỬ LÝ REQUEST GET (TEST CONNECTION)
// ═══════════════════════════════════════════════════════════════════
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ 
      status: "ok", 
      message: "Quiz Global 9 - Unit 7 API is running!",
      sheet: SHEET_NAME
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ═══════════════════════════════════════════════════════════════════
// HÀM TẠO HOẶC LẤY SHEET
// ═══════════════════════════════════════════════════════════════════
function getOrCreateSheet(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    
    // Tạo header
    const headers = [
      "Thời gian nộp",
      "Họ tên",
      "Lớp",
      "SĐT Phụ huynh",
      "Điểm",
      "Số câu đúng",
      "Tổng câu",
      "Thời gian làm",
      "Tỷ lệ %",
      "Xếp loại"
    ];
    
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // Format header
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight("bold");
    headerRange.setBackground("#4285f4");
    headerRange.setFontColor("#ffffff");
    headerRange.setHorizontalAlignment("center");
    
    // Đặt độ rộng cột
    sheet.setColumnWidth(1, 150); // Thời gian
    sheet.setColumnWidth(2, 180); // Họ tên
    sheet.setColumnWidth(3, 80);  // Lớp
    sheet.setColumnWidth(4, 120); // SĐT
    sheet.setColumnWidth(5, 70);  // Điểm
    sheet.setColumnWidth(6, 100); // Số câu đúng
    sheet.setColumnWidth(7, 80);  // Tổng câu
    sheet.setColumnWidth(8, 100); // Thời gian làm
    sheet.setColumnWidth(9, 80);  // Tỷ lệ
    sheet.setColumnWidth(10, 100); // Xếp loại
    
    // Freeze header row
    sheet.setFrozenRows(1);
  }
  
  return sheet;
}

// ═══════════════════════════════════════════════════════════════════
// HÀM TÍNH TỶ LỆ PHẦN TRĂM
// ═══════════════════════════════════════════════════════════════════
function calculatePercentage(correct, total) {
  const c = parseInt(correct) || 0;
  const t = parseInt(total) || 20;
  return Math.round((c / t) * 100) + "%";
}

// ═══════════════════════════════════════════════════════════════════
// HÀM XẾP LOẠI THEO ĐIỂM
// ═══════════════════════════════════════════════════════════════════
function getGrade(score) {
  if (score >= 9) return "Xuất sắc 🏆";
  if (score >= 8) return "Giỏi 🌟";
  if (score >= 6.5) return "Khá 👍";
  if (score >= 5) return "Trung bình 📚";
  return "Cần cố gắng 💪";
}

// ═══════════════════════════════════════════════════════════════════
// HÀM TEST (Chạy thử trước khi deploy)
// ═══════════════════════════════════════════════════════════════════
function testDoPost() {
  const mockEvent = {
    postData: {
      contents: JSON.stringify({
        name: "Nguyễn Văn A",
        className: "9A1",
        parentPhone: "0912345678",
        score: "8.5",
        correctCount: "17",
        totalQuestions: "20",
        timeUsed: "12:30"
      })
    }
  };
  
  const result = doPost(mockEvent);
  Logger.log(result.getContent());
}
