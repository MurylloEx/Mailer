import mjml from 'mjml';
import axios from 'axios';
import { join } from 'path';
import { MailerEnvelope } from './MailerEnvelope';
import { MailerResponse } from './MailerResponse';
import { fexists, fread } from './MailerFileSystem';
import { parseTemplateSyntax } from './MailerTemplateSyntaxParser';
import { MailerSandboxResult, MailerSandboxCallback } from './MailerSandboxResult';

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
  private m_MjmlTemplatePath: string = '';
  private m_MjmlTemplateOptions: Record<string, any> = {};
  private m_IsSandboxed: boolean = false;
  private m_SandboxCallback?: MailerSandboxCallback;

  private constructor() { }

  public static create(): Mailer {
    return new Mailer();
  }

  async envelope(): Promise<MailerEnvelope> {
    let textContent = this.m_TextBody ?? '';
    let htmlContent = this.m_HtmlBody ?? '';

    const textTemplateExists = await fexists(this.m_TextTemplatePath);
    const htmlTemplateExists = await fexists(this.m_HtmlTemplatePath);
    const mjmlTemplateExists = await fexists(this.m_MjmlTemplatePath);

    if (textTemplateExists) {
      textContent = await fread(this.m_TextTemplatePath);
    }
    if (htmlTemplateExists) {
      htmlContent = await fread(this.m_HtmlTemplatePath);
    }
    if (mjmlTemplateExists) {
      const mjmlContent = await fread(this.m_MjmlTemplatePath);
      htmlContent = mjml(mjmlContent, this.m_MjmlTemplateOptions).html;
    }

    const parsedTextContent = parseTemplateSyntax(textContent, this.m_Values);
    const parsedHtmlContent = parseTemplateSyntax(htmlContent, this.m_Values);

    return {
      api_key: this.m_SecretKey,
      to: this.m_Recipients,
      sender: `${this.m_SenderName} <${this.m_SenderEmail}>`,
      subject: this.m_SubjectText,
      text_body: parsedTextContent,
      html_body: parsedHtmlContent
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

  textBody(text: string): Mailer {
    this.m_TextBody = text;
    return this;
  }

  htmlBody(html: string): Mailer {
    this.m_HtmlBody = html;
    return this;
  }

  textTemplate(templateFile: string): Mailer {
    this.m_TextTemplatePath = join(process.cwd(), templateFile);
    return this;
  }

  htmlTemplate(templateFile: string): Mailer {
    this.m_HtmlTemplatePath = join(process.cwd(), templateFile);
    return this;
  }

  mjmlTemplate(templateFile: string, options?: Record<string, any>): Mailer {
    this.m_MjmlTemplatePath = join(process.cwd(), templateFile);
    this.m_MjmlTemplateOptions = options ?? {};
    return this;
  }
  
  set(valueName: string, value: string | number): Mailer {
    this.m_Values = {
      ...this.m_Values,
      [valueName]: value
    };
    return this;
  }

  sandbox(status: boolean, callback?: MailerSandboxCallback): Mailer {
    this.m_IsSandboxed = status;
    this.m_SandboxCallback = callback;
    return this;
  }

  send(): Promise<MailerResponse> {
    if (this.m_IsSandboxed) {
      return new Promise(async (resolve) => {
        const envelope = await this.envelope();

        const result: MailerSandboxResult = {
          ...envelope,
          values: this.m_Values,
          textTemplatePath: this.m_TextTemplatePath,
          htmlTemplatePath: this.m_HtmlTemplatePath,
          mjmlTemplatePath: this.m_MjmlTemplatePath,
          mjmlTemplateOptions: this.m_MjmlTemplateOptions
        };

        if (this.m_SandboxCallback) {
          this.m_SandboxCallback(result);
        }

        resolve(new MailerResponse().sandbox());
      });
    }

    return new Promise(async (resolve) => {
      HttpClient.post('/email/send', await this.envelope())
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
