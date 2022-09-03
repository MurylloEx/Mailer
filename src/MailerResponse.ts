import { MailerResponseData } from './MailerResponseData';

export class MailerResponse {

  private request_id?: string;
  private data: MailerResponseData;

  constructor() {
    this.data = new MailerResponseData();
  }

  /**
   * Build a MailerResponse instance from a JSON object.
   * 
   * @param response The JSON object returned by SMTP2GO API call.
   * @returns The MailerResponse instance.
   */
  build(response: any) {
    this.request_id = response?.request_id;
    this.data = this.data?.build(response?.data);
    return this;
  }

  /**
   * Returns a sandboxed MailerResponse instance.
   * 
   * @returns The MailerResponse instance.
   */
  sandbox() {
    const response = {
      request_id: "00000000-0000-0000-0000-000000000000",
      data: {
        succeeded: 1,
        failed: 0,
        failures: [],
        email_id: "xxxxxx-xxxxxx-xx"
      }
    };
    return this.build(response);
  }

  /**
   * Returns the Id of the email send request.
   * 
   * @return The email request ID.
   */
  getRequestId() {
    return this.request_id || null;
  }

  /**
   * Returns some metadata like the email id and the number of emails sent and bounced.
   * 
   * @return Request metadata for sending the email.
   */
  getData() {
    return this.data;
  }

  /**  
   * Returns a boolean indicating whether the email was sent successfully.
   * 
   * @return A boolean value.
   */
  success() {
    if (this.data != null) {
      return (this.data.getSucceeded() > 0) && (this.data.getFailed() == 0);
    }
    return false;
  }

}
