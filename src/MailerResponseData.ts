
export class MailerResponseData {

  private succeeded?: number;
  private failed?: number;
  private email_id?: string;

  build(response: any) {
    this.succeeded = response?.succeeded;
    this.failed = response?.failed;
    this.email_id = response?.email_id;
    return this;
  }

  /**
   * Returns the number of emails sent successfully.
   * 
   * @return The number of emails sent successfully.
   */
  getSucceeded() {
    return this.succeeded || 0;
  }

  /**
   * Returns the number of emails not sent or rejected.
   * 
   * @return Number of emails not sent or rejected.
   */
  getFailed() {
    return this.failed || 0;
  }

  /**
   * Returns an email ID in SMTP2GO.
   * 
   * @return A valid sent email id on SMTP2GO.
   */
  getEmailId() {
    return this.email_id || '';
  }

}
