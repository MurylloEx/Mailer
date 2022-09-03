export interface MailerSandboxResult {
  api_key?: string;
  to?: string[];
  sender: string;
  subject?: string;
  text_body: string;
  html_body: string;
  values: Record<string, string | number>;
  textTemplatePath: string;
  htmlTemplatePath: string;
  mjmlTemplatePath: string;
  mjmlTemplateOptions: Record<string, any>;
}

export type MailerSandboxCallback = (result: MailerSandboxResult) => void;
