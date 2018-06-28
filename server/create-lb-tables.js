var server = require('./server');
var ds = server.dataSources.mydb;
var lbTables = [
  'ApapunUsers'
];
ds.automigrate(lbTables, function(er) {
  if (er) throw er;
  console.log('Loopback tables [' - lbTables - '] created in ', ds.adapter.name);
  ds.disconnect();
});