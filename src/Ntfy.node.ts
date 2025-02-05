import {
  NodeConnectionType,
  type IExecuteSingleFunctions,
  type IHttpRequestOptions,
  type INodeType,
  type INodeTypeDescription,
} from "n8n-workflow";

export class Ntfy implements INodeType {
  description: INodeTypeDescription = {
    displayName: "ntfy",
    name: "ntfy",
    icon: { light: "file:ntfy.light.svg", dark: "file:ntfy.dark.svg" },
    group: ["transform"],
    version: 1,
    subtitle: '={{ $parameter["topic"] }}',
    description: "Push messages via ntfy.sh",
    defaults: {
      name: "ntfy",
    },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    requestDefaults: {
      baseURL: '={{ $credentials.baseUrl.replace(new RegExp("/$"), "") }}',
    },
    credentials: [
      {
        name: "ntfyApi",
        required: true,
      },
    ],
    properties: [
      {
        displayName: "Topic",
        name: "topic",
        type: "string",
        description:
          'Topic to <a href="https://docs.ntfy.sh/publish/#publishing">push</a> a message to',
        required: true,
        default: "",
        placeholder: "e.g. mytopic",
        routing: {
          request: {
            method: "POST",
            url: "=/{{ $parameter.topic }}",
          },
        },
      },
      {
        displayName: "Message",
        name: "message",
        type: "string",
        description: "Message to publish to a topic",
        required: true,
        default: "",
        placeholder: "e.g. Hello world!",
        routing: {
          send: { preSend: [populateMessage] },
        },
      },
      {
        displayName: "Send Additional Headers",
        name: "sendAdditionalHeaders",
        type: "boolean",
        default: false,
        noDataExpression: true,
        description:
          'Whether to send <a href="https://docs.ntfy.sh/publish/#list-of-all-parameters">additional headers</a> with the request',
      },
      {
        displayName: "Specify Headers Using...",
        name: "specifyHeadersUsing",
        type: "options",
        noDataExpression: true,
        displayOptions: {
          show: {
            sendAdditionalHeaders: [true],
          },
        },
        options: [
          {
            name: "Fields",
            value: "keypair",
          },
          {
            name: "JSON",
            value: "json",
          },
        ],
        default: "keypair",
      },
      {
        displayName: "Header Fields",
        name: "headerFields",
        type: "fixedCollection",
        displayOptions: {
          show: {
            sendAdditionalHeaders: [true],
            specifyHeadersUsing: ["keypair"],
          },
        },
        typeOptions: {
          multipleValues: true,
        },
        placeholder: "Add Header Field",
        routing: {
          send: { preSend: [populateHeaderFields] },
        },
        default: {
          parameters: [
            {
              name: "",
              value: "",
            },
          ],
        },
        options: [
          {
            name: "parameters",
            displayName: "Parameter",
            values: [
              {
                displayName: "Name",
                name: "name",
                type: "string",
                default: "",
                placeholder: "e.g. X-Title",
              },
              {
                displayName: "Value",
                name: "value",
                type: "string",
                default: "",
                placeholder: "e.g. This is a title",
              },
            ],
          },
        ],
      },
      {
        displayName: "JSON Headers",
        name: "jsonHeaders",
        type: "json",
        displayOptions: {
          show: {
            sendAdditionalHeaders: [true],
            specifyHeadersUsing: ["json"],
          },
        },
        routing: {
          send: { preSend: [populateJsonHeaders] },
        },
        default: '{ "X-Title": "This is a title" }',
      },
    ],
  };
}

async function populateMessage(
  this: IExecuteSingleFunctions,
  opts: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
  opts.body = this.getNodeParameter("message");
  return opts;
}

async function populateHeaderFields(
  this: IExecuteSingleFunctions,
  opts: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
  opts.headers ??= {};

  const { parameters } = this.getNodeParameter("headerFields") as {
    parameters: Array<{ name: string; value: string }>;
  };

  for (const p of parameters) {
    opts.headers[p.name] = p.value;
  }

  return opts;
}

async function populateJsonHeaders(
  this: IExecuteSingleFunctions,
  opts: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
  opts.headers = JSON.parse(this.getNodeParameter("jsonHeaders") as string);
  return opts;
}
