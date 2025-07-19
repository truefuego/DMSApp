const API_BASE_URL = process.env.API_BASE_URL || '';

export const generateOTP = async (mobile_number: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/generateOTP`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ mobile_number: mobile_number }),
        });
        return await response.json();
    } catch (error) {
        console.log('Error generating OTP:', error);
        throw new Error('Failed to generate OTP');
    }
};

export const validateOTP = async (mobile_number: string, otp: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/validateOTP`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ mobile_number, otp }),
        });
        
        const responseText = await response.text();

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        try {
            return JSON.parse(responseText);
        } catch (parseError) {
            console.error('JSON Parse Error:', parseError);
            throw new Error('Invalid response format from server');
        }
    } catch (error) {
        console.error('Validate OTP Error:', error);
        throw new Error('Failed to validate OTP');
    }
  };