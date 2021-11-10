
export class MailerResponseData {

  private succeeded?: number;
  private failed?: number;
  private email_id?: string;

  build(response: any){
    this.succeeded = response?.succeeded;
    this.failed = response?.failed;
    this.email_id = response?.email_id;
    return this;
  }

  /**
   * Retorna o número de emails enviados com sucesso.
   * 
   * @return O número de emails enviados com sucesso.
   */
  getSucceeded() {
    return this.succeeded || 0;
  }

  /**
   * Retorna o número de emails não enviados ou rejeitados.
   * 
   * @return Número de emails não enviados ou rejeitados.
   */
  getFailed() {
    return this.failed || 0;
  }

  /**
   * Retorna um ID do email no SMTP2GO.
   * 
   * @return Um Id do email enviado válido no SMTP2GO.
   */
  getEmailId() {
    return this.email_id || '';
  }

}

export class MailerResponse {

  private request_id?: string;
  private data: MailerResponseData;

  constructor(){
    this.data = new MailerResponseData();
  }

  build(response: any){
    this.request_id = response?.request_id;
    this.data = this.data?.build(response?.data);
    return this;
  }

  /**
   * Retorna o Id da solicitação de envio de email.
   * 
   * @return O Id da solicitação de email.
   */
  getRequestId(){
    return this.request_id || null;
  }

  /**
   * Retorna alguns metadados como o id do email e o número de emails enviados e rejeitados.
   * 
   * @return Metadados da solicitação do envio do email.
   */
  getData(){
    return this.data;
  }

  /**
   * Retorna um booleano indicando se o email foi enviado com sucesso.
   * 
   * @return Um valor booleano.
   */
  success(){
    if (this.data != null){
      return (this.data.getSucceeded() > 0) && (this.data.getFailed() == 0);
    }
    return false;
  }

}

