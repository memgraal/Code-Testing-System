import tempfile
from pathlib import Path


# ! TODO: Добавить nsjail для дополнительной эзаляции кода
class TempFolder:
    """
    Короче говоря, при использовании будем просто делать папку в папке,
    условно говоря, что при создании контейнера будет создаваться папка
    с ограничениями, в который лежит контейнер, а в котором уже исполняется код
    """
    def __init__(self, closeability: bool = True):
        self._temp_obj = None
        self.path = None
        self.closeability = closeability

    def __enter__(self):
        self._temp_obj = tempfile.TemporaryDirectory()
        self.path = Path(self._temp_obj.name)
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        if self._temp_obj and self.closeability:
            self._temp_obj.cleanup()

    def force_delete(self):
        if self._temp_obj:
            self._temp_obj.cleanup()

    def append_file(self, file_name, content: bytes):
        if self.path is None:
            raise RuntimeError("Временная папка ещё не создана")

        file_path = self.path / file_name
        file_path.parent.mkdir(parents=True, exist_ok=True)

        with open(file_path, "wb") as file:
            file.write(content)

        return file_path
