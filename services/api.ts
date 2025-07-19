const API_BASE_URL = process.env.API_BASE_URL || 'https://apis.allsoft.co/api/documentManagement';

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

export const uploadDocument = async (formData: FormData, token: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/saveDocumentEntry`, {
            method: 'POST',
            headers: {
                'token': token,
            },
            body: formData,
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
        console.error('Upload Error:', error);
        throw new Error('Failed to upload document');
    }
};
  
export const getDocumentTags = async (term: string, token: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/documentTags`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': token,
            },
            body: JSON.stringify({ term }),
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
        console.error('Tags Error:', error);
        throw new Error('Failed to get document tags');
    }
};

export const searchDocuments = async (searchData: any, token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/searchDocumentEntry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token,
        },
        body: JSON.stringify(searchData),
      });
      
      const responseText = await response.text();
      console.log('Search Response:', responseText);
      
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
      console.error('Search Error:', error);
      throw new Error('Failed to search documents');
    }
  };
  