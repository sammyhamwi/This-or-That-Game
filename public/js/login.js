document.getElementById('passwordInput').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        document.getElementById('submitPassword').click();
    }
});

async function initPage() {
    const isAuthenticated = await checkAuthentication();

    if (isAuthenticated) {
        window.location.href = '/';
    } else {
        requestPinForPage();
    }
}

async function checkAuthentication() {
    try {
        const response = await fetch('/api/checkAuth');
        const data = await response.json();
        return data.authStatus; // Return true if authenticated
    } catch (error) {
        console.error('Error checking authentication status:', error);
        return false;
    }
}

async function requestPinForPage() {
    $('#passwordModal').modal('show');
    
    document.getElementById('submitPassword').onclick = async function () {
        const enteredPin = document.getElementById('passwordInput').value.trim();
        
        try {
            const response = await fetch('/api/validatePassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password: enteredPin }),
            });

            const data = await response.json();

            if (data.valid) {
                $('#passwordModal').modal('hide');
                window.location.href = '/';
            } else {
                $('#passwordModal').modal('hide');
                $('#incorrectModal').modal('show');
                document.getElementById('passwordInput').value = "";
                document.getElementById('incorrectPassword').onclick = function () {
                    $('#incorrectModal').modal('hide');
                    $('#passwordModal').modal('show');
                };
            }
        } catch (error) {
            console.error('Error validating PIN:', error);
        }
    };
}

initPage();