import { useState, useEffect, useRef } from "react";
import { Upload, FolderOpen, FileText, Image, File, Trash2, Eye, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { getUser } from "@/lib/auth";

const catColor: Record<string, string> = {
  pan: "bg-blue-100 text-blue-700",
  gst: "bg-green-100 text-green-700",
  itr: "bg-purple-100 text-purple-700",
  aadhar: "bg-orange-100 text-orange-700",
  bank: "bg-yellow-100 text-yellow-700",
  dsc: "bg-pink-100 text-pink-700",
  other: "bg-gray-100 text-gray-600",
  general: "bg-gray-100 text-gray-600",
};

export default function Documents() {
  const [docs, setDocs] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [drag, setDrag] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState("other");
  const fileRef = useRef<HTMLInputElement>(null);
  const user = getUser();

  const load = () => {
    fetch(`/api/documents?firmId=${user?.firmId || ""}`)
      .then(r => r.json())
      .then(setDocs)
      .catch(() => setDocs([]));
  };

  useEffect(load, []);

  const filtered = docs.filter(d => filter === "all" || d.category === filter);

  const formatSize = (bytes: number) => {
    if (!bytes) return "–";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const uploadFiles = async (files: FileList | File[]) => {
    const arr = Array.from(files);
    if (!arr.length) return;
    setUploading(true);
    let success = 0;
    for (const file of arr) {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("firmId", user?.firmId || "");
      fd.append("category", category);
      fd.append("uploadedBy", user?.name || "Admin");
      fd.append("uploadedByRole", user?.role || "ca");
      try {
        const res = await fetch("/api/documents/upload", { method: "POST", body: fd });
        if (res.ok) success++;
        else toast.error(`Failed: ${file.name}`);
      } catch {
        toast.error(`Error uploading ${file.name}`);
      }
    }
    setUploading(false);
    if (success > 0) {
      toast.success(`${success} file${success > 1 ? "s" : ""} uploaded`);
      load();
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDrag(false);
    uploadFiles(e.dataTransfer.files);
  };

  const deleteDoc = async (id: string) => {
    if (!confirm("Delete this document?")) return;
    const res = await fetch(`/api/documents/${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Deleted"); load(); }
    else toast.error("Delete failed");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-500 text-sm">{docs.length} files stored</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {["pan","gst","itr","aadhar","bank","dsc","other"].map(c => (
              <option key={c} value={c}>{c.toUpperCase()}</option>
            ))}
          </select>
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="btn-blue flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-60"
          >
            <Upload className="w-4 h-4" /> {uploading ? "Uploading..." : "Upload"}
          </button>
          <input
            ref={fileRef}
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls,.doc,.docx"
            className="hidden"
            onChange={e => e.target.files && uploadFiles(e.target.files)}
          />
        </div>
      </div>

      {/* Upload Zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center mb-6 transition-all cursor-pointer
          ${drag ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"}`}
      >
        <Upload className={`w-10 h-10 mx-auto mb-3 ${drag ? "text-blue-500" : "text-gray-400"}`} />
        <p className="text-gray-600 font-medium">{uploading ? "Uploading files..." : "Drag & drop files here, or click to upload"}</p>
        <p className="text-gray-400 text-sm mt-1">PDF, JPG, PNG, Excel — Max 50MB per file</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {["all", "pan", "gst", "itr", "aadhar", "bank", "dsc", "other"].map(cat => (
          <button key={cat} onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${filter === cat ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"}`}>
            {cat.toUpperCase()} {cat !== "all" && docs.filter(d => d.category === cat).length > 0 && `(${docs.filter(d => d.category === cat).length})`}
          </button>
        ))}
      </div>

      <div className="grid gap-3">
        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <FolderOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No documents yet. Upload your first file above.</p>
          </div>
        )}
        {filtered.map(doc => (
          <Card key={doc.id} className="border-0 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    {doc.fileType === "pdf" ? <FileText className="w-5 h-5 text-red-500" /> :
                     ["jpg","jpeg","png"].includes(doc.fileType) ? <Image className="w-5 h-5 text-blue-500" /> :
                     <File className="w-5 h-5 text-gray-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${catColor[doc.category] || catColor.other}`}>
                        {doc.category?.toUpperCase()}
                      </span>
                      {doc.clientId && <span className="text-xs text-gray-400">Client: {doc.clientId}</span>}
                      <span className="text-xs text-gray-400">{formatSize(doc.fileSize)}</span>
                      <span className="text-xs text-gray-400">by {doc.uploadedBy}</span>
                      {doc.createdAt && (
                        <span className="text-xs text-gray-400">
                          {new Date(typeof doc.createdAt === "number" ? doc.createdAt * 1000 : doc.createdAt).toLocaleDateString("en-IN")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {doc.fileUrl && (
                    <a href={doc.fileUrl} target="_blank" rel="noreferrer"
                       className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100">
                      <Eye className="w-3 h-3" /> View
                    </a>
                  )}
                  {doc.fileUrl && (
                    <a href={doc.fileUrl} download={doc.name}
                       className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-100">
                      <Download className="w-3 h-3" /> Download
                    </a>
                  )}
                  <button onClick={() => deleteDoc(doc.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
