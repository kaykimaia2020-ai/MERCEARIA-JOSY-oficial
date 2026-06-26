export default function handler(request, response) {
  // Captura o IP real enviado pela Vercel através dos headers
  const ip = request.headers['x-forwarded-for'] || request.socket.remoteAddress;

  // Registra o IP para aparecer no painel da Vercel
  console.log("Visitante IP:", ip);

  // Configura os cabeçalhos para evitar erros de bloqueio (CORS)
  response.setHeader('Access-Control-Allow-Origin', '*');

  // Envia o IP de volta de forma segura
  response.status(200).json({ ip: ip });
}
