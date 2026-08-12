import hashlib

from django.contrib.auth.hashers import BasePasswordHasher, mask_hash
from django.utils.crypto import constant_time_compare


class LegacyScryptPasswordHasher(BasePasswordHasher):
    """Проверяет старые пароли Node.js и обновляет их после успешного входа."""

    algorithm = "legacy_scrypt"

    def salt(self):
        raise NotImplementedError("Этот формат используется только для импорта.")

    def encode(self, password, salt):
        digest = hashlib.scrypt(
            password.encode("utf-8"),
            salt=salt.encode("utf-8"),
            n=16384,
            r=8,
            p=1,
            dklen=64,
        ).hex()
        return f"{self.algorithm}${salt}${digest}"

    def decode(self, encoded):
        algorithm, salt, digest = encoded.split("$", 2)
        if algorithm != self.algorithm:
            raise ValueError("Неизвестный формат пароля.")
        return {"algorithm": algorithm, "salt": salt, "hash": digest}

    def verify(self, password, encoded):
        try:
            decoded = self.decode(encoded)
        except ValueError:
            return False
        actual = self.encode(password, decoded["salt"])
        return constant_time_compare(actual, encoded)

    def safe_summary(self, encoded):
        decoded = self.decode(encoded)
        return {
            "algorithm": self.algorithm,
            "salt": mask_hash(decoded["salt"]),
            "hash": mask_hash(decoded["hash"]),
        }

    def must_update(self, encoded):
        return True

    def harden_runtime(self, password, encoded):
        return None
