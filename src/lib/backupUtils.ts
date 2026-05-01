import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";

interface BackupData {
  version: string;
  exportDate: string;
  userData: {
    notes: any[];
    todos: any[];
    cgpa: any[];
    classes: any[];
    activity: any[];
  };
}

// Detect if running on native mobile
const isNative = (): boolean => Capacitor.isNativePlatform();

// Export all user data as JSON backup
export const exportBackup = async (userId: string): Promise<{ success: boolean; message: string }> => {
  const backup: BackupData = {
    version: "1.0",
    exportDate: new Date().toISOString(),
    userData: {
      notes: JSON.parse(localStorage.getItem("ss_notes") || "[]").filter((n: any) => n.userId === userId),
      todos: JSON.parse(localStorage.getItem("ss_todos") || "[]").filter((t: any) => t.userId === userId),
      cgpa: JSON.parse(localStorage.getItem("ss_cgpa") || "[]").filter((c: any) => c.userId === userId),
      classes: JSON.parse(localStorage.getItem("ss_classes") || "[]").filter((c: any) => c.userId === userId),
      activity: JSON.parse(localStorage.getItem("ss_activity") || "[]").filter((a: any) => a.userId === userId),
    },
  };

  const json = JSON.stringify(backup, null, 2);
  const fileName = `student-helper-backup-${new Date().toISOString().split("T")[0]}.json`;

  if (isNative()) {
    // Mobile: Use Capacitor Filesystem
    try {
      await Filesystem.writeFile({
        path: fileName,
        data: json,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });
      return { success: true, message: `Backup saved to Documents/${fileName}` };
    } catch (e) {
      // Fallback to External Storage
      try {
        await Filesystem.writeFile({
          path: fileName,
          data: json,
          directory: Directory.ExternalStorage,
          encoding: Encoding.UTF8,
        });
        return { success: true, message: `Backup saved to Downloads/${fileName}` };
      } catch (err) {
        return { success: false, message: "Failed to save backup file" };
      }
    }
  } else {
    // Web: Use blob download
    try {
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return { success: true, message: "Backup downloaded successfully!" };
    } catch (e) {
      return { success: false, message: "Failed to export backup" };
    }
  }
};

// Import backup data from file content string
const processImport = (content: string): { success: boolean; message: string } => {
  try {
    const backup: BackupData = JSON.parse(content);

    if (!backup.version || !backup.userData) {
      return { success: false, message: "Invalid backup file format" };
    }

    const mergeData = (key: string, newData: any[]) => {
      const existing = JSON.parse(localStorage.getItem(key) || "[]");
      const merged = [...existing];
      newData.forEach((item) => {
        const existingIdx = merged.findIndex((m: any) => m.id === item.id);
        if (existingIdx >= 0) {
          merged[existingIdx] = item;
        } else {
          merged.push(item);
        }
      });
      localStorage.setItem(key, JSON.stringify(merged));
    };

    mergeData("ss_notes", backup.userData.notes);
    mergeData("ss_todos", backup.userData.todos);
    mergeData("ss_cgpa", backup.userData.cgpa);
    mergeData("ss_classes", backup.userData.classes);
    mergeData("ss_activity", backup.userData.activity);

    return { success: true, message: "Backup imported successfully!" };
  } catch {
    return { success: false, message: "Failed to parse backup file" };
  }
};

// Import backup from File object (web)
export const importBackupFromFile = (file: File): Promise<{ success: boolean; message: string }> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      resolve(processImport(content));
    };
    reader.onerror = () => resolve({ success: false, message: "Failed to read file" });
    reader.readAsText(file);
  });
};

// Import backup on mobile using Capacitor Filesystem
export const importBackupMobile = async (): Promise<{ success: boolean; message: string }> => {
  try {
    // List files in Documents directory
    const result = await Filesystem.readdir({
      path: "",
      directory: Directory.Documents,
    });

    // Find backup files
    const backupFiles = result.files.filter(
      (f) => f.name.startsWith("student-helper-backup") && f.name.endsWith(".json")
    );

    if (backupFiles.length === 0) {
      return { success: false, message: "No backup files found in Documents folder" };
    }

    // Use the most recent backup file
    const latestFile = backupFiles[backupFiles.length - 1];

    const fileContent = await Filesystem.readFile({
      path: latestFile.name,
      directory: Directory.Documents,
      encoding: Encoding.UTF8,
    });

    return processImport(fileContent.data as string);
  } catch {
    return { success: false, message: "No backup file found. Export a backup first." };
  }
};

// Clear all user data
export const clearAllData = (userId: string): void => {
  const keys = ["ss_notes", "ss_todos", "ss_cgpa", "ss_classes", "ss_activity"];
  keys.forEach((key) => {
    const data = JSON.parse(localStorage.getItem(key) || "[]");
    const filtered = data.filter((item: any) => item.userId !== userId);
    localStorage.setItem(key, JSON.stringify(filtered));
  });
};
