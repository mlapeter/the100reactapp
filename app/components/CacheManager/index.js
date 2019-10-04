import * as _ from "lodash";
import * as FileSystem from 'expo-file-system'
import SHA1 from "crypto-js/sha1";

const BASE_DIR = `${FileSystem.cacheDirectory}expo-image-cache/`;

export class CacheEntry {
  // uri: string;
  // path: string;

  constructor(uri) {
    this.uri = uri;
  }

  async getPath() {
    try {
      const { uri } = this;
      const { path, exists, tmpPath } = await getCacheEntry(uri);
      if (exists) {
        return path;
      }
      await FileSystem.downloadAsync(uri, tmpPath);
      await FileSystem.moveAsync({ from: tmpPath, to: path });
      return path;
    }
    catch (e) {
      console.log("Error: ", e)
    }
  }
}

export default class CacheManager {
  static entries = {};

  static get(uri) {
    if (!CacheManager.entries[uri]) {
      CacheManager.entries[uri] = new CacheEntry(uri);
    }
    return CacheManager.entries[uri];
  }

  static async clearCache() {
    await FileSystem.deleteAsync(BASE_DIR, { idempotent: true });
    await FileSystem.makeDirectoryAsync(BASE_DIR);
  }
}

const getCacheEntry = async (uri) => {
  const filename = uri.substring(
    uri.lastIndexOf("/"),
    uri.indexOf("?") === -1 ? uri.length : uri.indexOf("?")
  );
  const ext =
    filename.indexOf(".") === -1
      ? ".jpg"
      : filename.substring(filename.lastIndexOf("."));
  const path = `${BASE_DIR}${SHA1(uri)}${ext}`;
  const tmpPath = `${BASE_DIR}${SHA1(uri)}-${_.uniqueId()}${ext}`;
  // TODO: maybe we don't have to do this every time
  try {
    await FileSystem.makeDirectoryAsync(BASE_DIR);
  } catch (e) {
    // do nothing
  }
  const info = await FileSystem.getInfoAsync(path);
  const { exists } = info;
  return { exists, path, tmpPath };
};
