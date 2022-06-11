const Ezviz = require('./lib/Ezviz')

module.exports = RED => {
  // Get door opening record
  RED.nodes.registerType('ezviz-ys7', class {
    constructor (config) {
      const node = this
      RED.nodes.createNode(node, config)
      const ezviz = RED.nodes.getNode(config.ezviz)
      node.on('input', async data => {
        try {
          const bd = new Ezviz(node, ezviz)

          // Combine the value, did not think about it
          for (const key in config) {if (config[key] !='' && config[key] != null) {data[key] = config[key]}}
          data.payload = data.deviceSerial || data.payload

          // Door opening record
          const open = await bd.openList(data)
          data.payload = open
          node.status({ text: `Successful acquisition:${data._msgid}` })
          node.send([data, null])
        } catch (err) {
          node.status({ text: err.message, fill:'red', shape:'ring' })
          node.warn(err)
          data.payload = {}
          data.error_msg = err.message
          node.send([null, data])
        }
      })
    }
  })

  // captureImage
  // Capture the current screen of the device
  RED.nodes.registerType('ezviz-capture', class {
    constructor (config) {
      const node = this
      RED.nodes.createNode(node, config)
      const ezviz = RED.nodes.getNode(config.ezviz)
      node.on('input', async data => {
        try {
          const bd = new Ezviz(node, ezviz)

          // Combine the value, did not think about it
          for (const key in config) {if (config[key] !='' && config[key] != null) {data[key] = config[key]}}
          data.payload = data.deviceSerial || data.payload

          const imagePath = await bd.captureImage(data)
          data.payload = imagePath
          node.status({ text: `Successful acquisition:${data._msgid}` })
          node.send([data, null])
        } catch (err) {
          node.status({ text: err.message, fill:'red', shape:'ring' })
          node.warn(err)
          data.payload = {}
          data.error_msg = err.message
          node.send([null, data])
        }
      })
    }
  })
  // presetMove
  // PTZ moves to the preset point
  RED.nodes.registerType('ezviz-preset-move', class {
    constructor (config) {
      const node = this
      RED.nodes.createNode(node, config)
      const ezviz = RED.nodes.getNode(config.ezviz)
      node.on('input', async data => {
        try {
          const bd = new Ezviz(node, ezviz)

          // Combine the value, did not think about it
          for (const key in config) {if (config[key] !='' && config[key] != null) {data[key] = config[key]}}
          data.payload = data.deviceSerial || data.payload

          const result = await bd.presetMove(data)
          data.payload = result
          node.status({ text: `Operation successful:${data._msgid}` })
          node.send([data, null])
        } catch (err) {
          node.status({ text: err.message, fill:'red', shape:'ring' })
          node.warn(err)
          data.payload = {}
          data.error_msg = err.message
          node.send([null, data])
        }
      })
    }
  })

  // cameraList
  // Get the camera list
  RED.nodes.registerType('ezviz-camera-list', class {
    constructor (config) {
      const node = this
      RED.nodes.createNode(node, config)
      const ezviz = RED.nodes.getNode(config.ezviz)
      node.on('input', async data => {
        try {
          const bd = new Ezviz(node, ezviz)

          // Combine the value, did not think about it
          for (const key in config) {if (config[key] !='' && config[key] != null) {data[key] = config[key]}}
          data.payload = data.pageStart || data.payload

          const result = await bd.cameraList(data)
          data.payload = result
          node.status({ text: `Operation successful:${data._msgid}` })
          node.send([data, null])
        } catch (err) {
          node.status({ text: err.message, fill:'red', shape:'ring' })
          node.warn(err)
          data.payload = {}
          data.error_msg = err.message
          node.send([null, data])
        }
      })
    }
  })

  // sceneSwitchStatus
  // Get the status of the lens mask switch
  RED.nodes.registerType('ezviz-scene-switch-status', class {
    constructor (config) {
      const node = this
      RED.nodes.createNode(node, config)
      const ezviz = RED.nodes.getNode(config.ezviz)
      node.on('input', async data => {
        try {
          const bd = new Ezviz(node, ezviz)

          // Combine the value, did not think about it
          for (const key in config) {if (config[key] !='' && config[key] != null) {data[key] = config[key]}}
          data.payload = data.deviceSerial || data.payload

          const result = await bd.sceneSwitchStatus(data)
          data.payload = result
          node.status({ text: `Operation successful:${data._msgid}` })
          node.send([data, null])
        } catch (err) {
          node.status({ text: err.message, fill:'red', shape:'ring' })
          node.warn(err)
          data.payload = {}
          data.error_msg = err.message
          node.send([null, data])
        }
      })
    }
  })

  // sceneSwitchSet
  // Set the lens shading switch
  RED.nodes.registerType('ezviz-scene-switch-set', class {
    constructor (config) {
      const node = this
      RED.nodes.createNode(node, config)
