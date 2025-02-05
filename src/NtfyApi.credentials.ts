import {
  ApplicationError,
  type ICredentialTestRequest,
  type ICredentialDataDecryptedObject,
  type ICredentialType,
  type IHttpRequestOptions,
  type INodeProperties,
  type Icon,
} from "n8n-workflow";

type NtfyCredentials =
  | {
      authType: "noAuth";
    }
  | {
      authType: "basicAuth";
      username: string;
      password: string;
    }
  | {
      authType: "bearerAuth";
      bearerToken: string;
    }
  | {
      authType: "queryAuth";
      queryParameter: string;
    };

export class NtfyApi implements ICredentialType {
  name = "ntfyApi";

  displayName = "ntfy API";

  icon: Icon = { light: "file:ntfy.light.svg", dark: "file:ntfy.dark.svg" };

  properties: INodeProperties[] = [
    {
      displayName: "Base URL",
      name: "baseUrl",
      type: "string",
      default: "https://ntfy.sh",
      description: "Base URL of the ntfy instance",
      required: true,
    },
    {
      displayName: "Auth Type",
      name: "authType",
      type: "options",
      description:
        '<a href="https://docs.ntfy.sh/publish/#authentication">Auth type</a> to use',
      required: true,
      options: [
        {
          name: "No Auth",
          value: "noAuth",
        },
        {
          name: "Basic Auth",
          value: "basicAuth",
        },
        {
          name: "Bearer Auth",
          value: "bearerAuth",
        },
        {
          name: "Query Auth",
          value: "queryAuth",
        },
      ],
      default: "noAuth",
    },
    {
      displayName: "Username",
      name: "username",
      type: "string",
      description:
        '<a href="https://docs.ntfy.sh/publish/#username-password">Username</a> for basic auth',
      default: "",
      required: true,
      displayOptions: {
        show: {
          authType: ["basicAuth"],
        },
      },
    },
    {
      displayName: "Password",
      name: "password",
      type: "string",
      description:
        '<a href="https://docs.ntfy.sh/publish/#username-password">Password</a> for basic auth',
      typeOptions: {
        password: true,
      },
      default: "",
      placeholder: "e.g. mypassword123",
      required: true,
      displayOptions: {
        show: {
          authType: ["basicAuth"],
        },
      },
    },
    {
      displayName: "Bearer Token",
      name: "bearerToken",
      required: true,
      description:
        '<a href="https://docs.ntfy.sh/publish/#access-tokens">Bearer token</a> for bearer auth',
      type: "string",
      typeOptions: { password: true },
      default: "",
      placeholder: "e.g. tk_AgQdq7mVBoFD37zQVN29RhuMzNIz2",
      displayOptions: {
        show: {
          authType: ["bearerAuth"],
        },
      },
    },
    {
      displayName: "Query Parameter",
      name: "queryParameter",
      type: "string",
      required: true,
      description:
        '<a href="https://docs.ntfy.sh/publish/#query-param">Query parameter</a> for auth',
      default: "",
      displayOptions: {
        show: {
          authType: ["queryAuth"],
        },
      },
    },
  ];

  test: ICredentialTestRequest = {
		request: {
			baseURL: '={{ $credentials.baseUrl }}',
			url: '/v1/health',
		},
	};

  async authenticate(
    credentials: ICredentialDataDecryptedObject,
    opts: IHttpRequestOptions,
  ): Promise<IHttpRequestOptions> {
    const c = credentials as NtfyCredentials;

    if (c.authType === "noAuth") return opts;

    if (c.authType === "basicAuth") {
      opts.auth = { username: c.username, password: c.password };
      return opts;
    }

    if (c.authType === "bearerAuth") {
      opts.headers = {
        Authorization: `Bearer ${c.bearerToken}`,
      };
      return opts;
    }

    if (c.authType === "queryAuth") {
      opts.url = `${opts.url}?auth=${c.queryParameter}`;
      return opts;
    }

    throw new ApplicationError("Invalid credentials type");
  }
  
}
