import axios from 'axios';
import { MailerEnvelope } from './MailerEnvelope';
import { MailerResponse } from './MailerResponse';
import { parseTemplateSyntax } from './MailerTemplateSyntaxParser';

const HttpClient = axios.create({
  baseURL: 'https://api.smtp2go.com/v3/',
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
});

export class Mailer {

  private m_SecretKey?: string;
  private m_SenderName?: string;
  private m_SenderEmail?: string;
  private m_Recipients?: string[] = [];
  private m_SubjectText?: string;
  private m_TextBody?: string;
  private m_HtmlBody?: string;
  private m_Values: Record<string, string | number> = {};

  private constructor() { }

  public static create(): Mailer {
    return new Mailer();
  }

  envelope(): MailerEnvelope {
    return {
      api_key: this.m_SecretKey,
      to: this.m_Recipients,
      sender: `${this.m_SenderName} <${this.m_SenderEmail}>`,
      subject: this.m_SubjectText,
      text_body: parseTemplateSyntax(this.m_TextBody || '', this.m_Values),
      html_body: parseTemplateSyntax(this.m_HtmlBody || '', this.m_Values)
    };
  }

  key(seckey: string) {
    this.m_SecretKey = seckey;
    return this;
  }

  from(senderName: string, senderEmail: string) {
    this.m_SenderName = senderName;
    this.m_SenderEmail = senderEmail;
    return this;
  }

  to(recipientName: string, recipientEmail: string) {
    this.m_Recipients?.push(`${recipientName} <${recipientEmail}>`);
    return this;
  }

  subject(text: string) {
    this.m_SubjectText = text;
    return this;
  }

  textBody(text: string) {
    this.m_TextBody = text;
    return this;
  }

  htmlBody(html: string) {
    this.m_HtmlBody = html;
    return this;
  }

  set(valueName: string, value: string | number) {
    this.m_Values = {
      ...this.m_Values,
      [valueName]: value
    };
    return this;
  }

  send(): Promise<MailerResponse> {
    return new Promise((resolve) => {
      HttpClient.post('/email/send', this.envelope())
        .then((result: any) => {
          const { data } = result || {};
          resolve(new MailerResponse().build(data));
        })
        .catch(() => {
          resolve(new MailerResponse());
        });
    });
  }

}
