export const authService = {
  login: async (email: string, password: string) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/v1/auth/login ', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Login gagal, periksa email/password");
      }

      const data = await response.json();
      return data;  
    } catch (error) {
      throw error;
    }
  },
};