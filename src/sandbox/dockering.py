import io
import os
import docker
from docker.errors import ImageNotFound

from enums import LanguageImage
from tempfolder import TempFolder


class DockerImageBuilder:

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

    def __init__(self, json_settings):
        self.json_settings = json_settings
        self.image_builder = DockerImageBuilder()

    def test_files(self,):
        pass

    def run(
        self,
        language_image: LanguageImage,
        codes: list[tuple[str, str]],
    ):

        self.image_builder.ensure_image(language_image)

        with TempFolder(closeability=True) as tmpf:

            # ! ПОДУМАТЬ КАК МОЖНО ТУТ ЭТО РЕАЛИЗОВАТЬ

            # ! -------------------------------------------------

            # ! Добавление файлов пользователя в контейнер
            for filename, code in codes:
                tmpf.append_file(filename, code)

            # ! Добавление файлов контейнера в контейнер
            tests_folder = os.path.join(tmpf, "tests")
            os.makedirs(tests_folder, exist_ok=True)

            # ! ------------------------------------------------

            volumes = {
                str(tmpf.path): {
                    "bind": "/sandbox",
                    "mode": "rw"
                }
            }

            container = self.image_builder.client.containers.run(

                image=language_image.full_name,
                command="/bin/sh runner.sh",
                working_dir="/sandbox",
                volumes=volumes,
                network_mode="none",
                mem_limit="256m",
                nano_cpus=1_000_000_000,
                pids_limit=64,
                read_only=True,
                tmpfs={
                    "/tmp": "rw,size=64m"
                },
                cap_drop=["ALL"],
                security_opt=["no-new-privileges"],
                user="1000:1000",
                detach=True,
                stdout=True,
                stderr=True,
            )

            result = container.wait()

            logs = container.logs(stdout=True, stderr=True)

            container.remove()

            return {
                "status": result,
                "logs": logs.decode("utf-8")
            }
