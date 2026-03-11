const testLogin = async () => {
    try {
        console.log('Testing login endpoint...\n');

        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'http://localhost:5173'  // Simulating frontend origin
            },
            body: JSON.stringify({
                username: 'admin',
                password: 'admin' // Replace with actual test credentials
            })
        });

        console.log('Status:', response.status, response.statusText);

        if (response.ok) {
            const data = await response.json();
            console.log('✓ Login successful!');
            console.log('Response:', JSON.stringify(data, null, 2));
        } else {
            const errorData = await response.json();
            console.log('✗ Login failed');
            console.log('Error:', JSON.stringify(errorData, null, 2));
        }

    } catch (error) {
        console.error('✗ Request failed:', error.message);
    }
};

testLogin();
