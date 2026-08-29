class ResVizError(Exception):
    """Base class for expected ResViz application errors."""
    pass


class LexerError(ResVizError):
    """Raised when the lexer encounters invalid input."""
    def __init__(self, message: str, position: int):
        super().__init__(message)
        self.position = position