import axios from 'axios'

export const api = axios.create({
    baseURL: 'https://jsonplaceholder.typicode.com'
})

export const getPostsPage = async (pageParam = 1, options = {}) => {
    console.log("Calling getPost page------------",pageParam)
    const response = await api.get(`/posts?_page=${pageParam}`, options)
    return response.data
}