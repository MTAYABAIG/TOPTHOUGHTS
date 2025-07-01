const healthCheck = (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Top Thought Blog API',
    version: '1.0.0'
  });
};

module.exports = {
  healthCheck,
};