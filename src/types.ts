import { NodeMessage } from 'node-red';

export interface ActionPayload {
  action: string; // TODO: Proper type
  data: unknown;
}
export type ActionResponsePayload = unknown;

export interface LinksysNodeMessage<TPayload> extends NodeMessage {
  payload?: TPayload;
}

export type ActionNodeMessage = LinksysNodeMessage<ActionPayload>;
export type ActionResponseNodeMessage =
  LinksysNodeMessage<ActionResponsePayload>;
