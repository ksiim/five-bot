import logging


def setup_logger():
    # Create a custom logger
    logger = logging.getLogger("fastapi_logger")
    logger.setLevel(logging.DEBUG)

    # Create handlers
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.DEBUG)

    # Create formatters and add it to handlers
    console_format = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    console_handler.setFormatter(console_format)

    # Add handlers to the logger
    logger.addHandler(console_handler)

    return logger


logger = setup_logger()
