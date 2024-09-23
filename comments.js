document.addEventListener('DOMContentLoaded', function() {

    const username = localStorage.getItem('username');
    const profilePicUrl = localStorage.getItem('profilePicUrl');

    if (!username || !profilePicUrl) {
        Swal.fire({
            icon: 'warning',
            title: 'تنبيه',
            text: 'الرجاء تسجيل الدخول أولاً',
            confirmButtonColor: '#2a9d8f'
        }).then(() => {
            window.location.href = 'index.html';
        });
        return;
    }

    document.getElementById('prideForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const message = document.getElementById('message').value;

        if (message) {
            const data = {
                text: message,
                likes: 0,
                replies: [],
                name: username,
                avatar: profilePicUrl
            };

            fetch('https://66f021d0f2a8bce81be51833.mockapi.io/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                console.log('تم إضافة التعليق بنجاح:', data);
                displayMessage(data);
                document.getElementById('message').value = ''; 
                Swal.fire({
                    icon: 'success',
                    title: 'تم الإرسال',
                    text: 'تم إضافة الرسالة بنجاح!',
                    confirmButtonColor: '#2a9d8f'
                });
            })
            .catch(error => {
                console.error('خطأ في إضافة التعليق:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'خطأ',
                    text: 'حدث خطأ أثناء إضافة الرسالة',
                    confirmButtonColor: '#2a9d8f'
                });
            });
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'تنبيه',
                text: 'الرجاء كتابة رسالة',
                confirmButtonColor: '#2a9d8f'
            });
        }
    });

    loadComments();
});

function loadComments() {
    fetch('https://66f021d0f2a8bce81be51833.mockapi.io/comments')
        .then(response => response.json())
        .then(comments => {
            comments.forEach(comment => {
                displayMessage(comment);
            });
        })
        .catch(error => {
            console.error('خطأ في تحميل التعليقات:', error);
        });
}

function displayMessage(message) {
    const messagesList = document.getElementById('messagesList');
    const li = document.createElement('li');
    
    li.innerHTML = `
        <div class="message-header">
            <img src="${message.avatar}" class="avatar" id="avatar-${message.id}">
            <strong>${message.name}</strong>
        </div>
        <p>${message.text}</p>
        <button class="reply-btn" onclick="showReplyForm('${message.id}')">رد</button>
        <ul class="replies" id="replies-${message.id}"></ul>
        <div class="reply-form-container" id="replyForm-${message.id}" style="display: none;">
            <textarea id="replyText-${message.id}" rows="2" placeholder="اكتب ردك هنا"></textarea>
            <button onclick="submitReply('${message.id}')">أرسل الرد</button>
        </div>
    `;

    messagesList.appendChild(li);

   
    const repliesList = document.getElementById(`replies-${message.id}`);
    message.replies.forEach(reply => {
        const replyLi = document.createElement('li');
        replyLi.textContent = reply;
        repliesList.appendChild(replyLi);
    });

   
    updateAvatarOpacity(message.id, message.replies.length);
}

function showReplyForm(messageId) {
    const replyForm = document.getElementById(`replyForm-${messageId}`);
    replyForm.style.display = replyForm.style.display === 'none' ? 'block' : 'none';
}

function submitReply(messageId) {
    const replyText = document.getElementById(`replyText-${messageId}`).value;

    if (replyText) {
        fetch(`https://66f021d0f2a8bce81be51833.mockapi.io/comments/${messageId}`, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
            const replies = data.replies || [];
            replies.push(replyText);

            fetch(`https://66f021d0f2a8bce81be51833.mockapi.io/comments/${messageId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ replies: replies })
            })
            .then(response => response.json())
            .then(updatedMessage => {
                const repliesList = document.getElementById(`replies-${messageId}`);
                const li = document.createElement('li');
                li.textContent = replyText;
                repliesList.appendChild(li);

                
                updateAvatarOpacity(messageId, updatedMessage.replies.length);
                document.getElementById(`replyText-${messageId}`).value = '';
                Swal.fire({
                    icon: 'success',
                    title: 'تم الإرسال',
                    text: 'تم إرسال ردك بنجاح!',
                    confirmButtonColor: '#2a9d8f'
                });
            });
        })
        .catch(error => {
            console.error('خطأ في الرد على التعليق:', error);
            Swal.fire({
                icon: 'error',
                title: 'خطأ',
                text: 'حدث خطأ أثناء إرسال الرد',
                confirmButtonColor: '#2a9d8f'
            });
        });
    }
}

function updateAvatarOpacity(messageId, numberOfReplies) {
    const avatar = document.getElementById(`avatar-${messageId}`);
    if (avatar) {
        avatar.style.opacity = Math.min(numberOfReplies * 0.1, 1);
    }
}

function logout() {
    localStorage.removeItem('username');
    localStorage.removeItem('profilePicUrl');
    window.location.href = 'index.html';
}
