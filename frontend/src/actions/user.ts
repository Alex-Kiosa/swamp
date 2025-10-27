import axios from "axios";

export const registration = async (name: string, email: string, password: string) => {
    try {
        const response = await axios.post("http://localhost:5000/api/auth/registration", {
            name,
            email,
            password
        })
        console.log(response.data.message)
    } catch (error){
        console.log(error.response.data.message)
    }
}