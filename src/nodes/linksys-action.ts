import { Node, NodeDef, NodeInitializer } from 'node-red';
import { nodePrefix } from '../constants';
import { ActionNodeMessage, ActionResponseNodeMessage } from '../types';
import { getCurrentDevice } from '../utils';

export interface ActionConfig extends NodeDef {
  device?: string;
}

const nodeInit: NodeInitializer = (RED) => {
  function ActionNode(config: ActionConfig) {
    RED.nodes.createNode(this, config);
    this.name = config.name;
    const node: Node = this;

    node.on('input', (msg: ActionNodeMessage) => {
      const { action = '', data = {} } = msg.payload || {};
      const device = getCurrentDevice(RED, config.device);
      if (!device) {
        node.error('Device is not initialized', msg);
        return;
      }
      if (!action) {
        node.error('Action is not specified', msg);
        return;
      }
      const availableActions = [
        'getInfo',
        'getDevices',
        'getNetworkConnections',
        'getBackhaulInfo',
      ];
      if (!availableActions.includes(action)) {
        node.error('Action is not specified', msg);
        return;
      }
      const method = device[action];
      method(data)
        .then((state) => {
          const outMsg: ActionResponseNodeMessage = {
            ...msg,
            payload: state,
          };
          node.send(outMsg);
        })
        .catch((error) => {
          node.error(`Error executing device action: ${error}`, msg);
        });
    });
  }

  RED.nodes.registerType(`${nodePrefix}action`, ActionNode);
};

export default nodeInit;
