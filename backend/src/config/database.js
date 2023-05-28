const mongoose = require('mongoose');

// mongoose.set("strictQuery", false);

const connection = async () => {
  var dbState = [
    {
      value: 0,
      label: 'Disconnected',
    },
    {
      value: 1,
      label: 'Connected',
    },
    {
      value: 2,
      label: 'Connecting',
    },
    {
      value: 3,
      label: 'Disconnecting',
    },
  ];

  await mongoose.connect(
    process.env.DB_LINK,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    () => {
      const state = Number(mongoose.connection.readyState);
      console.log(dbState.find((f) => f.value == state).label, 'to database');
    }
  );
};

module.exports = connection;
