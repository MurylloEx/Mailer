import axios from "axios";
import { MailerResponse } from "./response";

const client = axios.create({ 
  baseURL: 'https://api.smtp2go.com/v3/' 
});

export class Mailer {

  private m_SecretKey?: string;
  private m_SenderName?: string;
  private m_SenderEmail?: string;
  private m_Recipients?: string[] = [];
  private m_SubjectText?: string;
  private m_TextBody?: string;
  private m_HtmlBody?: string;

  key(seckey: string){
    this.m_SecretKey = seckey;
    return this;
  }

  from(senderName: string, senderEmail: string){
    this.m_SenderName = senderName;
    this.m_SenderEmail = senderEmail;
    return this;
  }

  to(recipientName: string, recipientEmail: string){
    this.m_Recipients?.push(`${recipientName} <${recipientEmail}>`);
    return this;
  }

  subject(text: string){
    this.m_SubjectText = text;
    return this;
  }

  textBody(text: string){
    this.m_TextBody = text;
    return this;
  }

  htmlBody(html: string){
    this.m_HtmlBody = html;
    return this;
  }

  send(): Promise<MailerResponse> {
    return new Promise((resolve, _reject) => {
      client.post('/email/send', {
        "api_key": this.m_SecretKey,
        "to": this.m_Recipients,
        "sender": `${this.m_SenderName} <${this.m_SenderEmail}>`,
        "subject": this.m_SubjectText,
        "text_body": this.m_TextBody || "",
        "html_body": this.m_HtmlBody || ""
      }, {
        headers: { 'Content-Type': 'application/json; charset=utf-8' }
      })
      .then((result: any) => {
        let { data } = result || {};
        resolve(new MailerResponse().build(data));
      })
      .catch(_ => { resolve(new MailerResponse()) });
    });
  }

}
