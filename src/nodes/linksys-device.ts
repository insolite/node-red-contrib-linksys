import { Node, NodeDef, NodeInitializer } from 'node-red';
import { LinksysDevice } from 'linksys-jnap';
import { nodePrefix } from '../constants';

export interface DeviceNode extends Node {
  device: LinksysDevice;
}

export interface DeviceConfig extends NodeDef {
  networkAddress?: string;
  password?: string;
}

const nodeInit: NodeInitializer = (RED) => {
  function DeviceNode(config: DeviceConfig) {
    RED.nodes.createNode(this, config);
    const node: DeviceNode = this;

    node.device = new LinksysDevice({
      origin: config.networkAddress || '192.168.1.1',
      password: config.password || '',
    });
  }

  RED.nodes.registerType(`${nodePrefix}device`, DeviceNode);
};

export default nodeInit;
