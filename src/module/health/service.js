import pool from '../../pool.js';

export async function checkHealth() {
  try {
    console.log({
      Body: {
        message: 'Checking health of the service...',
      },
    });
    console.log({
      Body: {
        message: 'Checking connectivity to database...',
      },
    });

    const result = await pool.query("select 'test' as test");
    if (result.rowCount !== 1 || result.rows[0].test !== 'test') {
      console.error({
        Body: {
          message: 'DB health check failed. Query did not return "test".',
          error: result,
        },
      });
      return {status: 'DOWN'};
    }

    console.log({
      Body: {
        message: `DB health check passed. rowCount: ${result.rowCount}, result: ${result.rows[0].test}`,
      },
    });

    return {status: 'UP'};
  } catch (err) {
    // something went wrong
    console.error({
      Body: {
        message: `unexpected error: ${err}`,
        error: err,
      },
    });
    return {status: 'DOWN'};
  }
}
