const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'ashwanitiwari301298@gmail.com',
        subject: 'Thanks! for joining in!',
        text: `Welcome to the app, ${name}. Let me know how you get alog with the app`
    })
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'ashwanitiwari301298@gmail.com',
        subject: 'We will miss you!',
        text: `We're sorry to see you go, ${name}. I hope to see you back somtime soon`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}