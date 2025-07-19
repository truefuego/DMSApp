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
        console.log('OTP Response:', response.status);
        return await response.json();
    } catch (error) {
        console.log('Error generating OTP:', error);
        throw new Error('Failed to generate OTP');
    }
};
  