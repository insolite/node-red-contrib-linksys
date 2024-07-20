import { NodeInitializer } from 'node-red';
import Device from './nodes/linksys-device';
import Action from './nodes/linksys-action';

const nodesInit: NodeInitializer = (RED) => {
  Device(RED);
  Action(RED);
};

export default nodesInit;
