import axios from 'axios'

export async function useApiCall(url: string, method: 'get' | 'post' | 'put' | 'delete' = 'post', data: any = null) {
  try {
    const response = await axios(
      {
        method,
        url,
        data,
        headers: {
          Accept: 'application/json',
        },
      })
    return { success: true, data: response.data }
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || 'Unknown error'
    return { success: false, error: message }
  }
}
