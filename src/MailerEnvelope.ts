export interface MailerEnvelope {
  api_key?: string;
  to?: string[];
  sender: string;
  subject?: string;
  text_body: string;
  html_body: string;
}
