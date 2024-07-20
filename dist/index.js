'use strict';

var linksysJnap = require('linksys-jnap');

const nodePrefix = "linksys-";

const nodeInit$1 = (RED) => {
  function DeviceNode(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    node.device = new linksysJnap.LinksysDevice({
      origin: config.networkAddress || "192.168.1.1",
      password: config.password || ""
    });
  }
  RED.nodes.registerType(`${nodePrefix}device`, DeviceNode);
};

const getCurrentDevice = (RED, deviceId) => {
  if (!deviceId) {
    return;
  }
  const deviceNode = RED.nodes.getNode(deviceId);
  if (!deviceNode) {
    return;
  }
  return deviceNode.device;
};

const nodeInit = (RED) => {
  function ActionNode(config) {
    RED.nodes.createNode(this, config);
    this.name = config.name;
    const node = this;
    node.on("input", (msg) => {
      const { action = "", data = {} } = msg.payload || {};
      const device = getCurrentDevice(RED, config.device);
      if (!device) {
        node.error("Device is not initialized", msg);
        return;
      }
      if (!action) {
        node.error("Action is not specified", msg);
        return;
      }
      const availableActions = [
        "getInfo",
        "getDevices",
        "getNetworkConnections"
      ];
      if (!availableActions.includes(action)) {
        node.error("Action is not specified", msg);
        return;
      }
      const method = device[action];
      method(data).then((state) => {
        const outMsg = {
          ...msg,
          payload: state
        };
        node.send(outMsg);
      }).catch((error) => {
        node.error(`Error executing device action: ${error}`, msg);
      });
    });
  }
  RED.nodes.registerType(`${nodePrefix}action`, ActionNode);
};

const nodesInit = (RED) => {
  nodeInit$1(RED);
  nodeInit(RED);
};

module.exports = nodesInit;
