import { defineStore } from 'pinia'

export const moduleStore = defineStore({
  id: 'module',
  state: () => ({
    data: [],
    loading: false,
    filters: null,
    downloading: false,
    storing: false,
    showing: false
  }),
  actions: {
    setData(v) {
      this.data = v
    },
    setDownloading(v) {
      this.downloading = v
    },

    async clearUrlParams() {
      const urlParams = new URLSearchParams()
      window.history.replaceState(
        history.state,
        '',
        `${window.location.pathname}?${urlParams.toString()}`
      )
    },
    async setUrlParams(v) {
      if (v) {
        const urlParams = new URLSearchParams()

        urlParams.set('filter', true)
        // Adiciona os novos parâmetros
        Object.keys(v).forEach((key) => {
          if (v[key] != null) {
            urlParams.set(key, v[key])
          }
        })
        // Atualiza a URL na barra de endereços sem recarregar a página
        window.history.replaceState(
          history.state,
          '',
          `${window.location.pathname}?${urlParams.toString()}`
        )
        core.setLastRoute(`${window.location.pathname}?${urlParams.toString()}`)
      }
    },
    async getData(apiRoute) {
      this.loading = true
      await axios
        .post(apiRoute, this.filters)
        .then((response) => {
          this.data = response?.data?.dataModule
        })
        .catch((error) => {
          this.data = []
        })
      this.loading = false
    },
    async getDataPart(apiRoute, part, filters = null, allowLoading = true) {
      if (allowLoading) {
        this.loading = true
      }

      this.filters = filters ?? this.filters

      const queryString = new URLSearchParams(window.location.search).toString()
      const url = queryString ? `${apiRoute}?${queryString}` : `${apiRoute}`

      try {
        const response = await axios.post(url, this.filters)
        const dataModule = response?.data?.dataModule
        part.forEach((p) => {
          this.data[p] = dataModule?.[p] ?? []
        })
      } catch (error) {
        part.forEach((p) => {
          this.data[p] = []
        })
      } finally {
        this.loading = false
      }
    },
    async getShow(apiRoute, part, queryString = false) {
      this.showing = true

      let url = apiRoute

      if (queryString) {
        const queryString = new URLSearchParams(window.location.search).toString()
        url = queryString ? `${apiRoute}?${queryString}` : `${apiRoute}`
      }

      await axios
        .post(url, this.filters)
        .then((response) => {
          const dataModule = response?.data?.dataModule
          part.forEach((p) => {
            this.data[p] = dataModule?.[p] ?? []
          })
        })
        .catch((error) => {
          part.forEach((p) => {
            this.data[p] = []
          })
        })
      this.showing = false
    },
    async setStore(apiRoute, form, part = []) {
      this.storing = true

      try {
        const response = await axios.post(apiRoute, form, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data'
          }
        })
        const dataModule = response?.data?.dataModule
        part.forEach((p) => {
          this.data[p] = dataModule?.[p] ?? []
        })

        this.storing = false
      } catch (error) {
        this.storing = false
      }
    },
    async getDownload(apiRoute, filters) {
      this.downloading = true
      try {
        const response = await axios.post(apiRoute, filters, { responseType: 'blob' })

        if (response.status === 200) {
          // Extrai o nome do arquivo do cabeçalho Content-Disposition
          const contentDisposition = response.headers['content-disposition']

          const fileName = contentDisposition
            ? contentDisposition.split('filename=')[1].split(';')[0].replace(/"/g, '')
            : 'downloaded_file' // nome padrão caso o cabeçalho não exista

          // Cria um link para download
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement('a')
          link.href = url

          // Define o nome do arquivo
          link.setAttribute('download', fileName)

          // Adiciona o link ao documento e clica nele para iniciar o download
          document.body.appendChild(link)
          link.click()

          // Remove o link após o download
          document.body.removeChild(link)
        } else if (response.status === 203) {
        }
      } catch (error) {
        console.log('Erro ao fazer o download', error)
      }

      this.downloading = false
    }
  }
})
