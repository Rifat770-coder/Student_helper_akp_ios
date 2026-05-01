import { useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import PageLayout from "@/components/layout/PageLayout";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import { Download, Upload, Trash2, AlertTriangle, FolderOpen } from "lucide-react";
import { exportBackup, importBackupFromFile, importBackupMobile, clearAllData } from "@/lib/backupUtils";
import { Capacitor } from "@capacitor/core";
import { motion } from "framer-motion";

const isNative = () => Capacitor.isNativePlatform();

const SettingsContent = () => {
  const { user } = useAuth();
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [exportMessage, setExportMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [importMessage, setImportMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showMsg = (
    setter: React.Dispatch<React.SetStateAction<{ type: "success" | "error"; text: string } | null>>,
    type: "success" | "error",
    text: string
  ) => {
    setter({ type, text });
    setTimeout(() => setter(null), 5000);
  };

  const handleExport = async () => {
    if (!user) return;
    setExporting(true);
    const result = await exportBackup(user.id);
    setExporting(false);
    showMsg(setExportMessage, result.success ? "success" : "error", result.message);
  };

  // Web: file picker
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    const result = await importBackupFromFile(file);
    setImporting(false);
    showMsg(setImportMessage, result.success ? "success" : "error", result.message);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (result.success) setTimeout(() => window.location.reload(), 1500);
  };

  // Mobile: read from Documents folder
  const handleMobileImport = async () => {
    setImporting(true);
    const result = await importBackupMobile();
    setImporting(false);
    showMsg(setImportMessage, result.success ? "success" : "error", result.message);
    if (result.success) setTimeout(() => window.location.reload(), 1500);
  };

  const handleClearData = () => {
    if (!user) return;
    clearAllData(user.id);
    setShowClearConfirm(false);
    window.location.reload();
  };

  return (
    <PageLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground mb-8">Manage your data and preferences</p>
      </motion.div>

      <div className="space-y-6">
        {/* Data Backup Section */}
        <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Data Backup</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Export your data to keep a backup or import previously exported data.
          </p>

          <div className="space-y-4">
            {/* Export */}
            <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                <Download className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Export Data</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {isNative()
                    ? "Save all your data as a JSON file in your Documents folder."
                    : "Download all your notes, tasks, classes, and CGPA data as a JSON file."}
                </p>
                <button
                  onClick={handleExport}
                  className="btn-primary text-sm"
                  disabled={exporting}
                >
                  <Download className="w-4 h-4" />
                  {exporting ? "Exporting..." : "Export Backup"}
                </button>
                {exportMessage && (
                  <div className={`mt-3 p-2 rounded text-sm ${
                    exportMessage.type === "success"
                      ? "bg-accent/10 text-accent"
                      : "bg-destructive/10 text-destructive"
                  }`}>
                    {exportMessage.text}
                  </div>
                )}
              </div>
            </div>

            {/* Import */}
            <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">
                <Upload className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Import Data</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {isNative()
                    ? "Restore from the latest backup file in your Documents folder."
                    : "Restore your data from a previously exported backup file."}
                </p>

                {isNative() ? (
                  // Mobile: single button reads from Documents
                  <button
                    onClick={handleMobileImport}
                    className="btn-outline text-sm"
                    disabled={importing}
                  >
                    <FolderOpen className="w-4 h-4" />
                    {importing ? "Importing..." : "Import from Documents"}
                  </button>
                ) : (
                  // Web: file picker
                  <>
                    <button
                      onClick={handleImportClick}
                      className="btn-outline text-sm"
                      disabled={importing}
                    >
                      <Upload className="w-4 h-4" />
                      {importing ? "Importing..." : "Import Backup"}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </>
                )}

                {importMessage && (
                  <div className={`mt-3 p-2 rounded text-sm ${
                    importMessage.type === "success"
                      ? "bg-accent/10 text-accent"
                      : "bg-destructive/10 text-destructive"
                  }`}>
                    {importMessage.text}
                  </div>
                )}

                {isNative() && (
                  <p className="text-xs text-muted-foreground mt-2">
                    💡 Export করার পর Documents folder এ backup file save হবে। Import করতে সেই file use হবে।
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-card rounded-xl p-6 border border-destructive/30 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            <h2 className="text-xl font-semibold text-destructive">Danger Zone</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            Irreversible actions that will permanently delete your data.
          </p>

          <div className="p-4 bg-destructive/5 rounded-lg border border-destructive/20">
            <h3 className="font-semibold mb-1">Clear All Data</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Permanently delete all your notes, tasks, classes, and CGPA data. This action cannot be undone.
            </p>
            {!showClearConfirm ? (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity text-sm"
              >
                <Trash2 className="w-4 h-4 inline mr-2" />
                Clear All Data
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-destructive">
                  Are you absolutely sure? This cannot be undone!
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleClearData}
                    className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity text-sm"
                  >
                    Yes, Delete Everything
                  </button>
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-sm text-muted-foreground">
            💡 <strong>Tip:</strong> Export your data regularly to prevent data loss. Your data is stored locally on your device.
          </p>
        </div>

        {/* Bottom spacer for fixed footer */}
        <div className="h-12" />
      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pb-[calc(env(safe-area-inset-bottom)+4rem)] pointer-events-none">
        <p className="text-xs text-muted-foreground/60 flex items-center gap-1">
          ✨ Crafted with <span className="text-red-400">❤️</span> by Minhajul Islam Rifat
        </p>
      </div>
    </PageLayout>
  );
};

const Settings = () => (
  <ProtectedRoute>
    <SettingsContent />
  </ProtectedRoute>
);

export default Settings;
