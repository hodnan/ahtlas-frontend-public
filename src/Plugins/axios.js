import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    Accept: 'application/json'
  }
})

// Adiciona um interceptador de resposta
axiosInstance.interceptors.response.use(
  async (response) => {
    notify.setErrors([])
    notify.setSuccess(null)

    // Verifica se a resposta é um Blob
    if (response?.data instanceof Blob && response?.data.type === 'application/json') {
      // Converte o Blob em texto para checar por erros
      const text = await response.data.text()
      const jsonData = JSON.parse(text)

      if (jsonData?.errors) {
        notify.setErrors(jsonData?.errors)
      }

      if (jsonData?.message && jsonData?.status === 'Success') {
        notify.setSuccess(jsonData?.message)
      }

      // Substitui os dados originais do response pelo JSON
      response.data = jsonData
    } else {
      // Continua com a lógica normal se não for Blob
      if (response?.data?.errors) {
        notify.setErrors(response?.data?.errors)
      }

      if (response?.data?.message && response?.data?.status === 'Success') {
        notify.setSuccess(response?.data?.message)
      }
    }

    return response
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      return Promise.resolve({ error: false, status: 401, message: 'Usuário não autorizado' })
    } else {
      notify.setErrors([['Erro ' + error?.response?.status + '!']])
      return Promise.reject(error)
    }
  }
)

export default axiosInstance
