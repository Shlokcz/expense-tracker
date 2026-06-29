import 'dotenv/config';

import app from './app';
import { logger } from './utils/logger';

const port = process.env.PORT || 4000;

app.listen(port, () => {
  logger.info(`Server running on port ${port} in ${process.env.NODE_ENV || 'development'} mode`);
});
