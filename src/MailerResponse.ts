import { MailerResponseData } from './MailerResponseData';

export class MailerResponse {

  private request_id?: string;
  private data: MailerResponseData;

  constructor() {
    this.data = new MailerResponseData();
  }

  build(response: any) {
    this.request_id = response?.request_id;
    this.data = this.data?.build(response?.data);
    return this;
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
