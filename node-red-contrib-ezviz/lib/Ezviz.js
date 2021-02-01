const axios = require('axios')
const moment = require('moment')
// Load method categories.
const array = require('lodash/array')
const EzvizCode = require('./EzvizCode')

// valid for 7 days, updated 8 hours in advance
const EXPIRE_TIME = (1000 * 3600 * 8 + 10 * 1000)
// open method
const openType = {0:'fingerprint', 1:'password', 2:'card'}

class EzvizClass {
  constructor (node, config) {
    this.node = node
    this.config = config
  }
  getToken () {
    const {set: setCache, get: getCache} = this.node.context().global
    const {client_id, client_secret} = this.config
    const cache_key = `ys7-${client_id}`
    return new Promise(async (resolve, reject) => {
      try {
        const cache = getCache(cache_key)
        if (cache && cache.time && ((cache.time-new Date().valueOf())> EXPIRE_TIME)) {
          // console.log('has cache', cache)
          resolve(cache.token)
          return
        }
        const {data} = await axios.post(`https://open.ys7.com/api/lapp/token/get?appKey=${client_id}&appSecret=${client_secret}`, {
          params: {grant_type:'client_credentials' },
          headers: {'Content-Type':'application/x-www-form-urlencoded'}
        }).catch(err => {
          throw new Error(`[Fluorite Token]${err}`)
        })
        if (data.code != 200) {
          const msg = EzvizCode[data.code] || data.msg
          throw new Error(`[Fluorite Token]${msg}`)
        }
        if (!data.data.accessToken) {
          reject(new Error('[Fluorite Token] token acquisition failed'))
        }
        setCache(cache_key, {
          token: data.data.accessToken,
          time: data.data.expireTime
        })
        resolve(data.data.accessToken)
      } catch (err) {reject(err)}
    })
  }

  openList (config) {
    return new Promise(async (resolve, reject) => {
      try {
        const token = await this.getToken()

        const {data} = await axios.post(`https://open.ys7.com/api/lapp/keylock/open/list?accessToken=${token}&deviceSerial=${config.payload}&pageStart=0&pageSize=20 `, {
          headers: {'Content-Type':'application/x-www-form-urlencoded'}
        }).catch(err => {
          throw new Error(`[fluorite keylock]${err}`)
        })

        if (data.code != 200) {
          const msg = EzvizCode[data.code] || data.msg
          throw new Error(`[fluorite keylock]${msg}`)
        }
        let res = data.data
        if (res) {
          res = res.map(function (item) {
            item.type = openType[item.openType]
            item.date = moment(item.openTime).format('YYYY-MM-DD HH:mm:ss')
            return item
          })
        } else {
          throw new Error(`[Fluorite keylock] no data`)
        }
        const {set: setCache, get: getCache} = this.node.context().global
        const {client_id} = this.config
        const cache_key = `ys7-openData-${client_id}`
        const cache = getCache(cache_key) || []
        // Compare and last difference data
        const diff = array.differenceBy(res, cache,'openTime')

        setCache(cache_key, res)

        resolve({ last: res[0], diff })
      } catch (error) {
        reject(error)
      }
    })
  }

  captureImage (config) {
    return new Promise(async (resolve, reject) => {
      try {
        const token = await this.getToken()

        const {data} = await axios.post(`https://open.ys7.com/api/lapp/device/capture?accessToken=${token}&deviceSerial=${config.payload}&channelNo=${config.channelNo }`, {
          headers: {'Content-Type':'application/x-www-form-urlencoded'}
        }).catch(err => {
          throw new Error(`[fluorite capture]${err}`)
        })

        if (data.code != 200) {
          const msg = EzvizCode[data.code] || data.msg
          throw new Error(`[fluorite capture]${msg}`)
        }
        resolve(data.data)
      } catch (error) {
        reject(error)
      }
    })
  }
  // PTZ control (call preset point)
  presetMove (config) {
    return new Promise(async (resolve, reject) => {
      try {
        const token = await this.getToken()

        const {data} = await axios.post(`https://open.ys7.com/api/lapp/device/preset/move?accessToken=${token}&deviceSerial=${config.payload}&channelNo=${config .channelNo}&index=${config.index}`, {
          headers: {'Content-Type':'application/x-www-form-urlencoded'}
        }).catch(err => {
          throw new Error(`[fluorite capture]${err}`)
        })

        if (data.code != 200) {
          const msg = EzvizCode[data.code] || data.msg
          throw new Error(`[fluorite capture]${msg}`)
        }
        resolve(data.data)
      } catch (error) {
        reject(error)
      }
    })
  }

  //Get the camera list
  cameraList (config) {
    return new Promise(async (resolve, reject) => {
      try {
        const token = await this.getToken()
        var url = `https://open.ys7.com/api/lapp/camera/list?accessToken=${token}`
        if(config.pageStart != null){
            url += "&pageStart="+config.pageStart
        }
        if(config.pageSize != null){
            url += "&pageSize="+config.pageSize
        }
        const {data} = await axios.post(url, {
          headers: {'Content-Type': '
