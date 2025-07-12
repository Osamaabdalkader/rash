// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-analytics.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    onAuthStateChanged, 
    signOut 
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { 
    getDatabase, 
    ref, 
    set, 
    push, 
    onValue, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";
import { 
    getStorage, 
    ref as storageRef, 
    uploadBytesResumable,
    getDownloadURL 
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAzYZMxqNmnLMGYnCyiJYPg2MbxZMt0co0",
    authDomain: "osama-91b95.firebaseapp.com",
    databaseURL: "https://osama-91b95-default-rtdb.firebaseio.com",
    projectId: "osama-91b95",
    storageBucket: "osama-91b95.appspot.com",
    messagingSenderId: "118875905722",
    appId: "1:118875905722:web:200bff1bd99db2c1caac83",
    measurementId: "G-LEM5PVPJZC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage(app);

// عناصر DOM
const homePage = document.getElementById('home-page');
const authPage = document.getElementById('auth-page');
const addPostPage = document.getElementById('add-post-page');
const profilePage = document.getElementById('profile-page');
const checkoutPage = document.getElementById('checkout-page');
const orderStatusPage = document.getElementById('order-status-page');
const completionPage = document.getElementById('completion-page');
const loadingOverlay = document.getElementById('loading-overlay');
const uploadProgress = document.getElementById('upload-progress');

const authMessage = document.getElementById('auth-message');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const logoutBtn = document.getElementById('logout-btn');
const publishBtn = document.getElementById('publish-btn');
const confirmPaymentBtn = document.getElementById('confirm-payment');
const confirmDeliveryBtn = document.getElementById('confirm-delivery');

const postsContainer = document.getElementById('posts-container');
const userInfo = document.getElementById('user-info');

const profileIcon = document.getElementById('profile-icon');
const addPostIcon = document.getElementById('add-post-icon');
const homeIcon = document.getElementById('home-icon');
const closeAuthBtn = document.getElementById('close-auth');
const closeAddPostBtn = document.getElementById('close-add-post');
const closeProfileBtn = document.getElementById('close-profile');
const closeCheckoutBtn = document.getElementById('close-checkout');
const closeOrderStatusBtn = document.getElementById('close-order-status');
const closeCompletionBtn = document.getElementById('close-completion');

// عناصر رفع الصورة
const postImageInput = document.getElementById('post-image');
const chooseImageBtn = document.getElementById('choose-image-btn');
const cameraBtn = document.getElementById('camera-btn');
const imageName = document.getElementById('image-name');
const imagePreview = document.getElementById('image-preview');
const previewImg = document.getElementById('preview-img');
const removeImageBtn = document.getElementById('remove-image-btn');

// تحميل المنشورات عند بدء التحميل
document.addEventListener('DOMContentLoaded', () => {
    loadPosts();
    
    // إضافة مستمعين لصفحات الشراء
    document.querySelectorAll('.post-card').forEach(card => {
        card.addEventListener('click', () => {
            showPage(checkoutPage);
        });
    });
    
    confirmPaymentBtn.addEventListener('click', () => {
        showPage(orderStatusPage);
        // بعد 3 ثوان سيظهر زر التأكيد (محاكاة للتسليم)
        setTimeout(() => {
            confirmDeliveryBtn.classList.remove('hidden');
        }, 3000);
    });
    
    confirmDeliveryBtn.addEventListener('click', () => {
        showPage(completionPage);
    });
});

// استمع لتغير حالة المستخدم
onAuthStateChanged(auth, user => {
    // لا شيء خاص هنا لأن المنشورات تظهر للجميع
});

// تحميل المنشورات للجميع
function loadPosts() {
    const postsRef = ref(database, 'posts');
    onValue(postsRef, (snapshot) => {
        postsContainer.innerHTML = '';
        
        if (snapshot.exists()) {
            const posts = snapshot.val();
            Object.keys(posts).reverse().forEach(postId => {
                const post = posts[postId];
                createPostCard(post);
            });
        } else {
            postsContainer.innerHTML = '<p class="no-posts">لا توجد منشورات بعد. كن أول من ينشر!</p>';
        }
    });
}

// إنشاء بطاقة منشور
function createPostCard(post) {
    const postCard = document.createElement('div');
    postCard.className = 'post-card';
    
    // إذا كان هناك صورة، نعرضها. وإلا نعرض أيقونة افتراضية.
    const imageContent = post.imageUrl 
        ? `<div class="post-image"><img src="${post.imageUrl}" alt="${post.title}"></div>`
        : `<div class="post-image"><i class="fas fa-image fa-3x"></i></div>`;
    
    postCard.innerHTML = `
        ${imageContent}
        <div class="post-content">
            <h3 class="post-title">${post.title}</h3>
            <p class="post-description">${post.description}</p>
            <div class="post-meta">
                ${post.price ? `<div class="post-price">${post.price}</div>` : ''}
                <div class="post-location"><i class="fas fa-map-marker-alt"></i> ${post.location}</div>
            </div>
            <div class="post-author">
                <i class="fas fa-user"></i> ${post.authorName}
                <span class="post-phone">${post.phone}</span>
            </div>
        </div>
    `;
    
    postsContainer.appendChild(postCard);
}

// تسجيل الدخول
loginBtn.addEventListener('click', e => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    if (!email || !password) {
        showAuthMessage('يرجى ملء جميع الحقول', 'error');
        return;
    }
    
    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            showAuthMessage('تم تسجيل الدخول بنجاح!', 'success');
            setTimeout(() => {
                showPage(homePage);
                resetAuthForms();
            }, 1500);
        })
        .catch(error => {
            showAuthMessage(getAuthErrorMessage(error.code), 'error');
        });
});

// إنشاء حساب
signupBtn.addEventListener('click', e => {
    e.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const phone = document.getElementById('signup-phone').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const address = document.getElementById('signup-address').value;
    
    if (!name || !phone || !email || !password || !address) {
        showAuthMessage('يرجى ملء جميع الحقول', 'error');
        return;
    }
    
    createUserWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
            const user = userCredential.user;
            
            // حفظ معلومات المستخدم الإضافية
            return set(ref(database, 'users/' + user.uid), {
                name: name,
                phone: phone,
                email: email,
                address: address
            });
        })
        .then(() => {
            showAuthMessage('تم إنشاء الحساب بنجاح!', 'success');
            setTimeout(() => {
                showPage(homePage);
                resetAuthForms();
            }, 1500);
        })
        .catch(error => {
            showAuthMessage(getAuthErrorMessage(error.code), 'error');
        });
});

// تسجيل الخروج
logoutBtn.addEventListener('click', () => {
    signOut(auth).then(() => {
        showPage(homePage);
    });
});

// نشر منشور جديد - الإصدار المصحح مع شريط التقدم
publishBtn.addEventListener('click', async e => {
    e.preventDefault();
    
    const user = auth.currentUser;
    if (!user) {
        showPage(authPage);
        return;
    }
    
    const title = document.getElementById('post-title').value;
    const description = document.getElementById('post-description').value;
    const price = document.getElementById('post-price').value;
    const location = document.getElementById('post-location').value;
    const phone = document.getElementById('post-phone').value;
    const imageFile = postImageInput.files[0];
    
    if (!title || !description || !location || !phone) {
        alert('يرجى ملء جميع الحقول المطلوبة');
        return;
    }
    
    try {
        // إظهار شاشة التحميل
        loadingOverlay.classList.remove('hidden');
        uploadProgress.style.width = '0%';
        
        let imageUrl = null;
        if (imageFile) {
            // استخدام uploadBytesResumable لتتبع التقدم
            const fileRef = storageRef(storage, 'post_images/' + Date.now() + '_' + imageFile.name);
            const uploadTask = uploadBytesResumable(fileRef, imageFile);
            
            // انتظار اكتمال الرفع مع تحديث شريط التقدم
            await new Promise((resolve, reject) => {
                uploadTask.on('state_changed',
                    (snapshot) => {
                        // تحديث شريط التقدم
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        uploadProgress.style.width = progress + '%';
                    },
                    (error) => {
                        reject(error);
                    },
                    () => {
                        // الرفع اكتمل بنجاح
                        resolve();
                    }
                );
            });
            
            // الحصول على رابط التحميل بعد اكتمال الرفع
            imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
        }
        
        // الحصول على بيانات المستخدم
        const userRef = ref(database, 'users/' + user.uid);
        const userSnapshot = await new Promise((resolve) => {
            onValue(userRef, (snapshot) => resolve(snapshot), { onlyOnce: true });
        });
        
        if (!userSnapshot.exists()) {
            throw new Error('بيانات المستخدم غير موجودة');
        }
        
        const userData = userSnapshot.val();
        
        // إنشاء كائن المنشور
        const postData = {
            title: title,
            description: description,
            price: price || '',
            location: location,
            phone: phone,
            authorId: user.uid,
            authorName: userData.name,
            authorPhone: userData.phone,
            timestamp: serverTimestamp(),
            imageUrl: imageUrl || ''
        };
        
        // حفظ المنشور في قاعدة البيانات
        await push(ref(database, 'posts'), postData);
        
        // إخفاء شاشة التحميل وإظهار الرسالة
        loadingOverlay.classList.add('hidden');
        alert('تم نشر المنشور بنجاح!');
        resetAddPostForm();
        showPage(homePage);
    } 
    catch (error) {
        console.error('Error adding post: ', error);
        loadingOverlay.classList.add('hidden');
        alert('حدث خطأ أثناء نشر المنشور: ' + error.message);
    }
});

// عرض معلومات المستخدم
profileIcon.addEventListener('click', () => {
    const user = auth.currentUser;
    
    if (user) {
        // عرض صفحة حساب المستخدم
        const userRef = ref(database, 'users/' + user.uid);
        onValue(userRef, (snapshot) => {
            if (snapshot.exists()) {
                const userData = snapshot.val();
                userInfo.innerHTML = `
                    <div class="user-detail">
                        <i class="fas fa-user"></i>
                        <span>${userData.name}</span>
                    </div>
                    <div class="user-detail">
                        <i class="fas fa-envelope"></i>
                        <span>${userData.email}</span>
                    </div>
                    <div class="user-detail">
                        <i class="fas fa-phone"></i>
                        <span>${userData.phone}</span>
                    </div>
                    <div class="user-detail">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${userData.address}</span>
                    </div>
                `;
            } else {
                userInfo.innerHTML = '<p>لا توجد بيانات للمستخدم</p>';
            }
            showPage(profilePage);
        }, { onlyOnce: true });
    } else {
        // عرض صفحة التوثيق
        showPage(authPage);
    }
});

// إضافة منشور جديد
addPostIcon.addEventListener('click', () => {
    const user = auth.currentUser;
    
    if (user) {
        resetAddPostForm();
        showPage(addPostPage);
    } else {
        showPage(authPage);
    }
});

// العودة للصفحة الرئيسية
homeIcon.addEventListener('click', () => {
    showPage(homePage);
});

// إغلاق الصفحات المختلفة
closeAuthBtn.addEventListener('click', () => showPage(homePage));
closeAddPostBtn.addEventListener('click', () => showPage(homePage));
closeProfileBtn.addEventListener('click', () => showPage(homePage));
closeCheckoutBtn.addEventListener('click', () => showPage(homePage));
closeOrderStatusBtn.addEventListener('click', () => showPage(homePage));
closeCompletionBtn.addEventListener('click', () => showPage(homePage));

// تغيير علامات التوثيق
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        if (btn.dataset.tab === 'login') {
            loginForm.classList.remove('hidden');
            signupForm.classList.add('hidden');
        } else {
            loginForm.classList.add('hidden');
            signupForm.classList.remove('hidden');
        }
    });
});

// اختيار صورة من المعرض
chooseImageBtn.addEventListener('click', () => {
    postImageInput.click();
});

// فتح الكاميرا (إذا كان الجهاز يدعمها)
cameraBtn.addEventListener('click', () => {
    postImageInput.setAttribute('capture', 'environment');
    postImageInput.click();
});

// عرض معاينة الصورة
postImageInput.addEventListener('change', function() {
    if (this.files && this.files[0]) {
        const file = this.files[0];
        imageName.textContent = file.name;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImg.src = e.target.result;
            imagePreview.classList.remove('hidden');
        }
        reader.readAsDataURL(file);
    }
});

// إزالة الصورة المختارة
removeImageBtn.addEventListener('click', () => {
    postImageInput.value = '';
    imageName.textContent = 'لم يتم اختيار صورة';
    imagePreview.classList.add('hidden');
});

// وظائف مساعدة
function showPage(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    page.classList.remove('hidden');
}

function showAuthMessage(message, type) {
    authMessage.textContent = message;
    authMessage.className = '';
    authMessage.classList.add(type + '-message');
}

function getAuthErrorMessage(code) {
    switch(code) {
        case 'auth/invalid-email':
            return 'البريد الإلكتروني غير صالح';
        case 'auth/user-disabled':
            return 'هذا الحساب معطل';
        case 'auth/user-not-found':
            return 'لا يوجد حساب مرتبط بهذا البريد الإلكتروني';
        case 'auth/wrong-password':
            return 'كلمة المرور غير صحيحة';
        case 'auth/email-already-in-use':
            return 'هذا البريد الإلكتروني مستخدم بالفعل';
        case 'auth/weak-password':
            return 'كلمة المرور ضعيفة (يجب أن تحتوي على 6 أحرف على الأقل)';
        default:
            return 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى';
    }
}

function resetAddPostForm() {
    document.getElementById('post-title').value = '';
    document.getElementById('post-description').value = '';
    document.getElementById('post-price').value = '';
    document.getElementById('post-location').value = '';
    document.getElementById('post-phone').value = '';
    postImageInput.value = '';
    imageName.textContent = 'لم يتم اختيار صورة';
    imagePreview.classList.add('hidden');
}

function resetAuthForms() {
    document.getElementById('login-email').value = '';
    document.getElementById('login-password').value = '';
    document.getElementById('signup-name').value = '';
    document.getElementById('signup-phone').value = '';
    document.getElementById('signup-email').value = '';
    document.getElementById('signup-password').value = '';
    document.getElementById('signup-address').value = '';
    authMessage.textContent = '';
    authMessage.className = '';
    }
