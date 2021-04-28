const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// default opening hours
let days = [
  {
    label: "Måndag",
    name: "monday",
    value: "8 - 16",
  },
  {
    label: "Tisdag",
    name: "tuesday",
    value: "8 - 16",
  },
  {
    label: "Onsdag",
    name: "wednesday",
    value: "8 - 16",
  },
  {
    label: "Torsdag",
    name: "thursday",
    value: "8 - 16",
  },
  {
    label: "Fredag",
    name: "friday",
    value: "8 - 16",
  },
  {
    label: "Lördag",
    name: "saturday",
    value: "stängt",
  },
  {
    label: "Söndag",
    name: "sunday",
    value: "stängt",
  },
];
let clients = [];

function eventsHandler(req, res, next) {
  // Mandatory headers and http status to keep connection open aka SSE
  const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  };
  res.writeHead(200, headers);
  // After client opens connection send all days as string
  const data = `data: ${JSON.stringify(days)}\n\n`;
  res.write(data);
  // Generate an id based on timestamp and save res
  // object of client connection on clients list
  // Later we'll iterate it and send updates to each client
  const clientId = Date.now();
  const newClient = {
    id: clientId,
    res
  };
  clients.push(newClient);
  // When client closes connection we update the clients list
  // avoiding the disconnected one
  req.on('close', () => {
    console.log(`${clientId} Connection closed`);
    clients = clients.filter(c => c.id !== clientId);
  });
}
app.get('/events', eventsHandler);

// Iterate clients list and use write res object method to send new nest
function sendEventsToAll(days) {
  //console.log(clients);
  clients.forEach(c => c.res.write(`data: ${JSON.stringify(days)}\n\n`))
}
// Middleware for POST /nest endpoint
async function setDays(req, res, next) {
  // update "db" :)
  days = req.body;
  // respond
  res.json({ok: true});
  // Invoke iterate and send function
  return sendEventsToAll(days);
}
app.post('/openhours', setDays);

app.get('/openhours', (req, res) => {
    res.json(days);
});

app.listen(8082, () => {
    console.log('server is listening on port 8082');
});