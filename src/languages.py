import abc
import subprocess
from typing import List
from pathlib import Path


class AbstractProgrammingLanguage(abc.ABC):

    @abc.abstractmethod
    def running_file(self) -> str:
        pass

    @abc.abstractmethod
    def compilation(self, workdir: Path) -> None:
        pass

    @abc.abstractmethod
    def run_commands(self, filename: str) -> List[str]:
        pass


class PythonPL(AbstractProgrammingLanguage):

    def running_file(self) -> str:
        return "main.py"

    def compilation(self, workdir: Path) -> None:
        return

    def run_commands(self):
        return ["python3", self.running_file()]


class CppPL(AbstractProgrammingLanguage):
    def file_name(self) -> str:
        return "main.cpp"

    def compile(self, workdir: Path) -> None:
        subprocess.run(
            ["g++", self.file_name(), "-O2", "-o", "main"],
            cwd=workdir,
            check=True,
        )

    def run_command(self) -> list[str]:
        return ["./main"]


class JavaLanguage(AbstractProgrammingLanguage):

    def file_name(self) -> str:
        return "Main.java"

    def compile(self, workdir: Path) -> None:
        subprocess.run(
            ["javac", self.file_name()],
            cwd=workdir,
            check=True,
        )

    def run_command(self) -> list[str]:
        return ["java", "Main"]
