// Di auth.service.ts - hanya tambahkan method getCurrentUser
export const authService = {
  login: async (email: string, password: string) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/auth/login', {
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

  
  getCurrentUser: async (email: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:8000/api/v1/users/?email=${email}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error('Gagal mengambil data user');
      }

      const data = await response.json();
      const users = data.data || data;
      const currentUser = users.find((user: any) => user.email === email);
      return currentUser || null;
    } catch (error) {
      console.error("Error getting current user:", error);
      throw error;
    }
  }
};