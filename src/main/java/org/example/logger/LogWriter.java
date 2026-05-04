package org.example.logger;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class LogWriter {
    private final Logger logger;

    public LogWriter(Object owner) {
        this.logger = LoggerFactory.getLogger(owner.getClass());
    }

    public void logInfo(String message) {
        logger.info(message);
    }

    public void logErr(String message) {
        logger.error(message);
    }

    public void logWarn(String message) {
        logger.warn(message);
    }
}
