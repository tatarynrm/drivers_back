const nodemailer = require('nodemailer')

class MailService {


constructor(){
    this.transporter = nodemailer.createTransport({
        host:1 ,
        port:1 ,
        ssecure:false ,
        auth: {

        } 
    })
}

  async sendActivationMain(to,link) {}
}

module.exports = new MailService();
