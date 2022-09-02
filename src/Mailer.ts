import axios from 'axios';
import { join } from 'path';
import { MailerEnvelope } from './MailerEnvelope';
import { MailerResponse } from './MailerResponse';
import { parseTemplateSyntax } from './MailerTemplateSyntaxParser';
import { fexists, fread } from './MailerFileSystem';

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
  private m_TextTemplatePath: string = '';
  private m_HtmlTemplatePath: string = '';

  private constructor() { }

  public static create(): Mailer {
    return new Mailer();
  }

  async envelope(): Promise<MailerEnvelope> {
    let textContent = '';
    let htmlContent = '';

    const textTemplateExists = await fexists(this.m_TextTemplatePath);
    const htmlTemplateExists = await fexists(this.m_HtmlTemplatePath);

    if (textTemplateExists) {
      textContent = await fread(this.m_TextTemplatePath);
    }
    if (htmlTemplateExists) {
      htmlContent = await fread(this.m_HtmlTemplatePath);
    }

    return {
      api_key: this.m_SecretKey,
      to: this.m_Recipients,
      sender: `${this.m_SenderName} <${this.m_SenderEmail}>`,
      subject: this.m_SubjectText,
      text_body: parseTemplateSyntax(this.m_TextBody || textContent, this.m_Values),
      html_body: parseTemplateSyntax(this.m_HtmlBody || htmlContent, this.m_Values)
    };
  }

  key(seckey: string): Mailer {
    this.m_SecretKey = seckey;
    return this;
  }

  from(senderName: string, senderEmail: string): Mailer {
    this.m_SenderName = senderName;
    this.m_SenderEmail = senderEmail;
    return this;
  }

  to(recipientName: string, recipientEmail: string): Mailer {
    this.m_Recipients?.push(`${recipientName} <${recipientEmail}>`);
    return this;
  }

  subject(text: string): Mailer {
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

  textTemplate(templateFile: string) {
    this.m_TextTemplatePath = join(process.cwd(), templateFile);
    return this;
  }

  htmlTemplate(templateFile: string) {
    this.m_HtmlTemplatePath = join(process.cwd(), templateFile);
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
