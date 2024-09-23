document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const profilePicUrl = document.getElementById('profilePicUrl').value.trim();

    if (!username || !email || !password || !profilePicUrl) {
        Swal.fire({
            icon: 'error',
            title: 'خطأ',
            text: 'الرجاء إدخال جميع البيانات',
            confirmButtonColor: '#2a9d8f'
        });
        return;
    }

    if (!validateEmail(email)) {
        Swal.fire({
            icon: 'error',
            title: 'خطأ',
            text: 'البريد الإلكتروني غير صحيح',
            confirmButtonColor: '#2a9d8f'
        });
        return;
    }

    if (password.length < 6) {
        Swal.fire({
            icon: 'error',
            title: 'خطأ',
            text: 'كلمة المرور يجب أن تكون على الأقل 6 أحرف',
            confirmButtonColor: '#2a9d8f'
        });
        return;
    }

    if (!validateUrl(profilePicUrl)) {
        Swal.fire({
            icon: 'error',
            title: 'خطأ',
            text: 'رابط الصورة غير صحيح',
            confirmButtonColor: '#2a9d8f'
        });
        return;
    }

    const data = {
        name: username,
        email: email,
        password: password,
        avatar: profilePicUrl
    };

    fetch('https://66f021d0f2a8bce81be51833.mockapi.io/Profile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        Swal.fire({
            icon: 'success',
            title: 'تم',
            text: 'تم تسجيل الحساب بنجاح!',
            confirmButtonColor: '#2a9d8f'
        }).then(() => {
            window.location.href = 'login.html'; 
        });
    })
    .catch(error => {
        console.error('خطأ في تسجيل الحساب:', error);
        Swal.fire({
            icon: 'error',
            title: 'خطأ',
            text: 'حدث خطأ في تسجيل الحساب',
            confirmButtonColor: '#2a9d8f'
        });
    });
});

function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

function validateUrl(url) {
    try {
        new URL(url);
        return true;
    } catch (_) {
        return false;
    }
}
