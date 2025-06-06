// الحصول على مرجع لقاعدة البيانات
const database = firebase.database();

// دالة لتنسيق التاريخ
function formatDate(timestamp) {
    if (!timestamp) return 'غير معروف';
    
    const date = new Date(timestamp);
    return date.toLocaleString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// دالة لعرض الرسائل
function showMessage(message, isSuccess = true) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.className = isSuccess ? 'message-success' : 'message-error';
    
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}