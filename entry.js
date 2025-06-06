// حفظ البيانات عند تقديم النموذج
document.getElementById('dataForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // جمع بيانات النموذج
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const city = document.getElementById('city').value;
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const notes = document.getElementById('notes').value;
    
    // إنشاء مرجع جديد في قاعدة البيانات
    const newDataRef = database.ref('users').push();
    
    newDataRef.set({
        name: name,
        email: email,
        phone: phone || 'غير محدد',
        city: city,
        gender: gender,
        notes: notes || 'لا يوجد',
        timestamp: firebase.database.ServerValue.TIMESTAMP
    })
    .then(() => {
        showMessage('تم حفظ البيانات بنجاح!', true);
        document.getElementById('dataForm').reset();
    })
    .catch((error) => {
        console.error('Error saving data: ', error);
        showMessage('حدث خطأ أثناء الحفظ: ' + error.message, false);
    });
});