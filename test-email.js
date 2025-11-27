require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('🔍 Verificando configuración SMTP...\n');

console.log('SMTP_HOST:', process.env.SMTP_HOST);
console.log('SMTP_PORT:', process.env.SMTP_PORT);
console.log('SMTP_USER:', process.env.SMTP_USER);
console.log('SMTP_PASS:', process.env.SMTP_PASS ? '✅ Configurado' : '❌ No configurado');
console.log('BUSINESS_EMAIL:', process.env.BUSINESS_EMAIL);
console.log('\n---\n');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

console.log('📧 Verificando conexión...\n');

transporter.verify(function (error, success) {
  if (error) {
    console.log('❌ ERROR al conectar con el servidor SMTP:');
    console.log(error);
  } else {
    console.log('✅ Servidor SMTP listo para enviar emails');
    console.log('\n🧪 Enviando email de prueba...\n');
    
    transporter.sendMail({
      from: `"Esencia Pura Test" <${process.env.SMTP_USER}>`,
      to: process.env.BUSINESS_EMAIL,
      subject: '🧪 Test de Email - Esencia Pura',
      text: 'Este es un email de prueba desde el sistema de reservas.',
      html: '<p><strong>✅ Email funcionando correctamente</strong></p><p>Este es un email de prueba desde Esencia Pura.</p>'
    }, (error, info) => {
      if (error) {
        console.log('❌ ERROR al enviar email:');
        console.log(error);
      } else {
        console.log('✅ Email enviado exitosamente!');
        console.log('📬 Message ID:', info.messageId);
      }
      process.exit(0);
    });
  }
});
