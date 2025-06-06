// عناصر واجهة المستخدم
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');
const cityFilter = document.getElementById('cityFilter');
const dataBody = document.getElementById('dataBody');
const recordCount = document.getElementById('recordCount');

// تحميل البيانات عند فتح الصفحة
window.addEventListener('DOMContentLoaded', loadData);

// تحميل البيانات مع الفلترة
function loadData() {
    const usersRef = database.ref('users').orderByChild('timestamp');
    
    usersRef.once('value')
    .then((snapshot) => {
        dataBody.innerHTML = '';
        let count = 0;
        
        if (!snapshot.exists()) {
            dataBody.innerHTML = '<tr><td colspan="7" style="text-align:center">لا توجد بيانات</td></tr>';
            recordCount.textContent = '0';
            return;
        }
        
        snapshot.forEach((childSnapshot) => {
            const user = childSnapshot.val();
            const userId = childSnapshot.key;
            
            // تطبيق الفلتر
            const searchTerm = searchInput.value.toLowerCase();
            const cityFilterValue = cityFilter.value;
            
            const matchesSearch = !searchTerm || 
                user.name.toLowerCase().includes(searchTerm) || 
                user.email.toLowerCase().includes(searchTerm);
            
            const matchesCity = !cityFilterValue || user.city === cityFilterValue;
            
            if (matchesSearch && matchesCity) {
                count++;
                const row = document.createElement('tr');
                
                row.innerHTML = `
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.phone}</td>
                    <td>${user.city}</td>
                    <td>${user.gender}</td>
                    <td>${formatDate(user.timestamp)}</td>
                    <td>
                        <button class="btn-delete" data-id="${userId}">حذف</button>
                    </td>
                `;
                
                dataBody.appendChild(row);
            }
        });
        
        recordCount.textContent = count;
        
        // إضافة معالجات الأحداث لأزرار الحذف
        document.querySelectorAll('.btn-delete').forEach(button => {
            button.addEventListener('click', function() {
                const userId = this.getAttribute('data-id');
                deleteUser(userId);
            });
        });
        
        if (count === 0) {
            dataBody.innerHTML = '<tr><td colspan="7" style="text-align:center">لا توجد بيانات تطابق معايير البحث</td></tr>';
        }
    })
    .catch((error) => {
        console.error('Error loading data: ', error);
        showMessage('حدث خطأ أثناء تحميل البيانات: ' + error.message, false);
    });
}

// البحث
searchBtn.addEventListener('click', loadData);
searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        loadData();
    }
});

// إعادة تعيين البحث
clearBtn.addEventListener('click', function() {
    searchInput.value = '';
    cityFilter.value = '';
    loadData();
});

// فلترة حسب المدينة
cityFilter.addEventListener('change', loadData);

// حذف مستخدم
function deleteUser(userId) {
    if (confirm('هل أنت متأكد من حذف هذا السجل؟')) {
        database.ref('users/' + userId).remove()
        .then(() => {
            showMessage('تم حذف السجل بنجاح', true);
            loadData();
        })
        .catch((error) => {
            console.error('Error deleting user: ', error);
            showMessage('حدث خطأ أثناء الحذف: ' + error.message, false);
        });
    }
}