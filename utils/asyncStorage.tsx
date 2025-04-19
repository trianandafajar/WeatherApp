import AsyncStorage from "@react-native-async-storage/async-storage";

// Simpan data ke AsyncStorage
export const storeData = async (key: string, value: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error("AsyncStorage Store Error:", error);
  }
};

// Ambil data dari AsyncStorage
export const getData = async (key: string): Promise<string | null> => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (error) {
    console.error("AsyncStorage Get Error:", error);
    return null;
  }
};

// Ambil data tapi bisa pakai fallback default jika null
export const getDataWithFallback = async (key: string, fallback: string): Promise<string> => {
  const value = await getData(key);
  return value ?? fallback;
};

// Hapus data
export const removeData = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error("AsyncStorage Remove Error:", error);
  }
};
