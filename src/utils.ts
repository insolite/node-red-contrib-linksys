import { NodeAPI, Node } from 'node-red';
import { LinksysDevice } from 'linksys-jnap';

interface DeviceNode extends Node {
  device?: LinksysDevice;
}

export const getCurrentDevice = (
  RED: NodeAPI,
  deviceId?: string,
): LinksysDevice | undefined => {
  if (!deviceId) {
    return;
  }
  const deviceNode = RED.nodes.getNode(deviceId) as DeviceNode;
  if (!deviceNode) {
    return;
  }
  return deviceNode.device;
};
