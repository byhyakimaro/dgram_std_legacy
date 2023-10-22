const dgram = require('dgram');

const checkNatType = () => {
  const socket = dgram.createSocket('udp4');
  const stunServer = 'stun.l.google.com';
  const stunPort = 19302;

  socket.on('message', (message) => {
    const response = new Uint8Array(message);
    const responseType = response[0] & 0x03;

    let natType;
    switch (responseType) {
      case 1:
        natType = 'Open Internet';
        break;
      case 2:
        natType = 'Full Cone NAT';
        break;
      case 3:
        natType = 'Restricted NAT';
        break;
      default:
        natType = 'Unknown NAT Type';
    }

    console.log('Tipo de NAT:', natType);
    socket.close();
  });

  const stunRequest = new Uint8Array(20);
  stunRequest[0] = 0x00;
  stunRequest[1] = 0x01;
  stunRequest[2] = 0x00;
  stunRequest[3] = 0x00;
  stunRequest[4] = 0x21;
  stunRequest[5] = 0x12;
  stunRequest[6] = 0xa4;
  stunRequest[7] = 0x42;
  stunRequest[8] = 0x2b;
  stunRequest[9] = 0xe3;
  stunRequest[10] = 0x21;
  stunRequest[11] = 0x12;
  stunRequest[12] = 0xa4;
  stunRequest[13] = 0x42;
  stunRequest[14] = 0x2b;
  stunRequest[15] = 0xe3;

  socket.send(stunRequest, 0, stunRequest.length, stunPort, stunServer);
};

checkNatType();
