export function parseFirmwareVersion(version) {
  if (typeof version !== "string" || !/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(version)) {
    throw new Error("Firmware-Version muss MAJOR.MINOR.PATCH sein.");
  }
  const parts = version.split(".").map(Number);
  if (parts.some(function (part) { return !Number.isSafeInteger(part); })) throw new Error("Firmware-Version ist zu groß.");
  return parts;
}

export function compareFirmwareVersions(left, right) {
  const a = parseFirmwareVersion(left);
  const b = parseFirmwareVersion(right);
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return a[i] > b[i] ? 1 : -1;
  }
  return 0;
}

export function validateFirmwareManifest(manifest) {
  if (!manifest || typeof manifest !== "object" || Array.isArray(manifest)) throw new Error("Versionsmeldung ist ungültig.");
  parseFirmwareVersion(manifest.version);
  if (manifest.firmware !== "firmware.bin" || typeof manifest.sha256 !== "string" || !/^[a-f\d]{64}$/i.test(manifest.sha256)) {
    throw new Error("Versionsmeldung enthält kein gültiges Firmware-Image.");
  }
  return { version: manifest.version, firmware: manifest.firmware, sha256: manifest.sha256.toLowerCase() };
}
