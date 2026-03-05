from enum import StrEnum
from dataclasses import dataclass


class CodeVerdict(StrEnum):
    OK = ("OK", "Accepted")
    WA = ("WA", "Wrong Answer")
    TLE = ("TLE", "Time Limit Exceeded")
    MLE = ("MLE", "Memory Limit Exceeded")
    RE = ("RE", "Runtime Error")
    CE = ("CE", "Compilation Error")

    def __init__(self, answer: str, description: str) -> str:
        self.answer = answer
        self.description = description

    def __str__(self) -> str:
        return self.answer

    def is_success(self) -> bool:
        return self is CodeVerdict.OK


@dataclass
class LanguageImage:
    name: str
    tag: str
    dockerfile: str

    @property
    def full_name(self) -> str:
        return f"{self.name}:{self.tag}"


PYTHON_DOCKERFILE = """
FROM python:3.11-slim

RUN useradd -m runner
WORKDIR /sandbox
USER runner

CMD ["sleep", "infinity"]
"""


CPP_DOCKERFILE = """
FROM debian:bookworm-slim

RUN apt-get update && \
    apt-get install -y --no-install-recommends g++ && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

RUN useradd -m runner
WORKDIR /sandbox
USER runner

CMD ["sleep", "infinity"]
"""


JAVA_DOCKERFILE = """
FROM openjdk:17-slim

RUN useradd -m runner
WORKDIR /sandbox
USER runner

CMD ["sleep", "infinity"]
"""
