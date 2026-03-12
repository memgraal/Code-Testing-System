import io
from pathlib import Path

import docker
from docker.errors import ImageNotFound

from enums import LanguageImage
from tempfolder import TempFolder


class DockerImageBuilder:
    # ! Штука для подстарховки, писал до согласования логики Image
    def __init__(self):
        self.client = docker.from_env()

    def ensure_image(self, language_image: LanguageImage):

        try:
            self.client.images.get(language_image.full_name)

        except ImageNotFound:
            self._build(language_image)

    def _build(self, language_image: LanguageImage):

        self.client.images.build(

            fileobj=io.BytesIO(
                language_image.dockerfile.encode("utf-8"),
            ),

            tag=language_image.full_name,
            rm=True,
            forcerm=True,
            pull=True,
            encoding="utf-8",
        )


class DockerContainer:

    def __init__(self):
        self.image_builder = DockerImageBuilder()
        self.client = docker.from_env()

    def _test_files(self, temp_folder: TempFolder, task_id: int):
        # Тут уже из бд получиам тесты и добавляем их в папку
        _files = ...
        for test_file in _files:
            temp_folder.append_file(f"tests/{test_file.name}", test_file)

    def _test_runner(
        self,
        temp_folder: TempFolder,
        language_image: LanguageImage,
    ):

        compile_cmd = language_image.compile_cmd or ""
        run_cmd = language_image.run_cmd

        script = f"""#!/bin/bash

        {compile_cmd}

        for input in tests/*.in
        do
            output="${{input%.in}}.out"

            result=$(timeout 2s {run_cmd} < "$input")

            expected=$(cat "$output")

            if [ "$result" = "$expected" ]; then
                echo "$input: OK"
            else
                echo "$input: FAIL"
                echo "Expected: $expected"
                echo "Got: $result"
            fi
        done
        """

        temp_folder.append_file("run.sh", script.encode())

    def run(
        self,
        language_image: LanguageImage,
        temp_folder: TempFolder,
        task_id: int,
    ):

        # self.image_builder.ensure_image(language_image)

        self._test_files(temp_folder, task_id)

        self._test_runner(temp_folder, language_image)

        workspace = Path(temp_folder.path).resolve()

        container = self.client.containers.run(
            image=language_image.full_name,

            volumes={
                str(workspace): {
                    "bind": "/sandbox",
                    "mode": "rw"
                }
            },

            working_dir="/sandbox",

            command="bash /sandbox/run.sh",

            detach=True,
            stdout=True,
            stderr=True,

            network_disabled=True,
            mem_limit="256m",
            pids_limit=64,
        )

        result = container.wait()

        logs = container.logs().decode()

        container.remove()

        return result["StatusCode"], logs
