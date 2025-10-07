export const validateEmail = (email: string) => {
    // const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const regex = /^[^@]+@[^@]+\.[^@]+$/

    return regex.test(email)
}