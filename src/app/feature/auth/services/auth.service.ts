export const authService= {
    login: async (email:string, password:string) =>{
        // const response = await fetch('http://localhost:4000/users/login', {
        //     method: 'POST',
        //     headers: {
        //       'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({ email, password }),
        //   });
        //   return response.json();   

        await new Promise((resolve) => setTimeout(resolve, 1000));  

        if (email==="admin@gmail.com" && password==="admin") {
         return {
        success: true,
        token: "dummy-jwt-token",
        user: { id: 1, name: "Admin", email },
      };
    }
    throw new Error("Invalid email or password");
    }
}

