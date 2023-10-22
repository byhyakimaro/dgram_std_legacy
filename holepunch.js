const dgram = require('dgram');
const facilitatorServer = dgram.createSocket('udp4');

const clients = {};

facilitatorServer.on('message', (message, remote) => {
  const data = message.toString();
  const [action, clientId, clientAddress, clientPort] = data.split(',');

  if (action === 'register') {
    clients[clientId] = { address: clientAddress, port: clientPort };
  } else if (action === 'connect') {
    const targetClient = clients[clientId];
    if (targetClient) {
      // Cliente recebeu detalhes do outro cliente (targetClient.address, targetClient.port)
      // Inicia a conexão direta com o outro cliente
      const directClient = dgram.createSocket('udp4');
      
      // Lógica para manipular eventos de conexão e recebimento de mensagens
      directClient.on('listening', () => {
        console.log('Conexão direta estabelecida com', targetClient.address, targetClient.port);
        // Agora você pode enviar e receber mensagens diretamente com o outro cliente
        directClient.send('Olá, cliente!', 0, 'Olá, cliente!'.length, targetClient.port, targetClient.address);
      });

      directClient.on('message', (message, remote) => {
        console.log('Mensagem recebida do outro cliente:', message.toString());
      });

      directClient.bind(); // Permite que o SO escolha uma porta disponível para o cliente
    }
  }
});

facilitatorServer.bind(12345);

// Cliente que deseja estabelecer a conexão
const client = dgram.createSocket('udp4');
client.send('register,client1,localhost,3000', 0, 'register,client1,localhost,3000'.length, 12345, 'facilitator-server-address');

// Lógica para esperar a resposta do servidor facilitador e iniciar a conexão direta
client.on('message', (message, remote) => {
  const data = message.toString();
  if (data === 'connect') {
    // O servidor facilitador enviou a mensagem 'connect', indicando que a conexão direta pode ser iniciada
    client.send('connect,client1', 0, 'connect,client1'.length, 12345, 'facilitator-server-address');
  }
});
