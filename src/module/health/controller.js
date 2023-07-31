import * as service from './service.js';

export async function checkHealth(req,res) {
  try {
    const result = await service.checkHealth();
    if (result.status === 'UP') {
      res.status(200).json({
        status: 'UP',
      });
      return;
    } else {
      res.status(500).json({
        status: 'DOWN',
      });
      return;
    }
  } catch (err) {
    // Something went wrong:
    console.error({
      Body: {
        message: `unexpected error: ${err}`,
        error: err,
      },
    });
    res.status(500).json({
      status: 'DOWN',
    });
  }
}
