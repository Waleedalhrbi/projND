document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) {
        Swal.fire({
            icon: 'error',
            title: 'خطأ',
            text: 'الرجاء إدخال البريد الإلكتروني وكلمة المرور',
            confirmButtonColor: '#2a9d8f'
        });
        return;
    }

    fetch('https://66f021d0f2a8bce81be51833.mockapi.io/Profile')
    .then(response => response.json())
    .then(users => {
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            localStorage.setItem('username', user.name);
            localStorage.setItem('profilePicUrl', user.avatar);

            Swal.fire({
                icon: 'success',
                title: 'نجاح',
                text: 'تم تسجيل الدخول بنجاح!',
                confirmButtonColor: '#2a9d8f'
            }).then(() => {
                window.location.href = 'comments.html';
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'خطأ',
                text: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
                confirmButtonColor: '#2a9d8f'
            });
        }
    })
    .catch(error => {
        console.error('خطأ في تسجيل الدخول:', error);
        Swal.fire({
            icon: 'error',
            title: 'خطأ',
            text: 'حدث خطأ في تسجيل الدخول',
            confirmButtonColor: '#2a9d8f'
        });
    });
});
